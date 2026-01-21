'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function completeOnboarding(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const role = formData.get('role') as string
    const fullName = formData.get('fullName') as string
    const gradeLevel = formData.get('gradeLevel') as string

    // Simple validation
    if (!role || !fullName) {
        return { error: 'Missing required fields' }
    }

    // Update profile
    const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        role,
        full_name: fullName,
        grade_level: role === 'student' ? gradeLevel : null,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
    })

    if (error) {
        console.error('Onboarding Error:', error)
        return { error: `Failed to update profile: ${error.message}` }
    }

    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard')
}
