
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL is not set in .env.local');
    process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL, {
    ssl: 'require',
    max: 1
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

async function deploy() {
    console.log('🚀 Starting Database Deployment...');

    const filesToRun = [
        'supabase/profiles-schema.sql',
        'supabase/courses-schema.sql',
    ];

    // Find all migrations in supabase/migrations
    const migrationsDir = path.join(ROOT_DIR, 'supabase', 'migrations');
    if (fs.existsSync(migrationsDir)) {
        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(f => f.endsWith('.sql'))
            .sort() // Ensure order
            .map(f => `supabase/migrations/${f}`);

        filesToRun.push(...migrationFiles);
    }

    // Add Seeds LAST (After migrations)
    filesToRun.push('supabase/courses-seed.sql');
    filesToRun.push('supabase/seed_knowledge.sql');

    // Add seed data if explicit argument provided? Or just always run schema? 
    // For "Rapid Prototyping", let's run schema + structure.
    // Seeds might conflict if unique constraints exist, but `ON CONFLICT` in SQL helps.

    // Attempt to run them
    for (const relativePath of filesToRun) {
        const fullPath = path.join(ROOT_DIR, relativePath);
        if (!fs.existsSync(fullPath)) {
            console.warn(`⚠️ File not found: ${relativePath}`);
            continue;
        }

        console.log(`\n📂 Executing: ${relativePath}`);

        try {
            await sql.file(fullPath);
            console.log(`✅ Success: ${relativePath}`);
        } catch (err: any) {
            console.error(`❌ Failed: ${relativePath}`);
            console.error(`   Error: ${err.message}`);
            // Don't exit process, try next file? Or stop?
            // Stop is safer.
            process.exit(1);
        }
    }

    // Force schema cache reload just in case
    console.log('\n🔄 Reloading Schema Cache...');
    try {
        await sql`NOTIFY pgrst, 'reload config'`;
        console.log('✅ Cache Reloaded');
    } catch (e) {
        console.warn('⚠️ Could not reload cache (might need superuser):', e);
    }

    console.log('\n✨ Deployment Complete!');
    await sql.end();
}

deploy().catch(err => {
    console.error('Fatal Error:', err);
    process.exit(1);
});
