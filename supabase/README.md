# Hướng dẫn chạy migrations với Supabase CLI

## Cài đặt Supabase CLI (nếu chưa có):

### Windows (PowerShell):
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### macOS:
```bash
brew install supabase/tap/supabase
```

## Cách sử dụng:

### 1. Login:
```bash
npx supabase login
```

### 2. Link project:
```bash
npx supabase link --project-ref YOUR_PROJECT_ID
```

### 3. Chạy migration:
```bash
npx supabase db push --db-url YOUR_DATABASE_URL
```

### Hoặc apply từ file:
```bash
psql YOUR_DATABASE_URL < supabase/profiles-schema.sql
```

## Lưu ý:
- `YOUR_PROJECT_ID`: Lấy từ Supabase Dashboard > Settings > General
- `YOUR_DATABASE_URL`: Settings > Database > Connection String (Direct connection)

## Khuyến nghị:
Với lần đầu setup, nên dùng **Supabase Dashboard** (Option 1) cho đơn giản.
CLI tốt hơn khi bạn có nhiều migrations cần chạy thường xuyên.
