import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/login') &&
        !request.nextUrl.pathname.startsWith('/auth') &&
        !request.nextUrl.pathname.startsWith('/register')
    ) {
        // no user, redirect to login
        // BUT allow public routes like landing page if exists, or just protect dashboard
        // For now, let's protect everything except login/register/auth
        // If root '/' is public, we should allow it. Assuming '/' is landing.
        if (request.nextUrl.pathname !== '/') {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
    }

    // If user is logged in, check profile? 
    // We can do that here or in a separate check.
    // The plan said: "If logged in but no profile/role -> Redirect to /onboarding"
    // Let's implement that logic if we can access DB here.
    // Ideally middleware should be fast. Calling DB might be okay for Supabase.

    if (user) {
        // Redirect to dashboard if logged in and trying to access auth pages
        if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')) {
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }

        // Check for onboarding status
        // If they are on onboarding, allow it
        if (request.nextUrl.pathname.startsWith('/onboarding')) {
            return supabaseResponse
        }

        // Check profile
        // NOTE: This requires 'profiles' table to be created in Supabase
        const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', user.id)
            .single()

        // If no profile or not completed, force onboarding
        // Only enforce this if we are NOT on the landing page (optional, but good for UX)
        // If we want to force onboarding immediately after login, we do it for all protected routes.
        if (!profile || !profile.onboarding_completed) {
            // Allow them to visit landing page if needed? No, force wizard if they are logged in context.
            // But if they just landed on homepage, maybe don't force redirect? 
            // Stick to strict: Logged in = Must have profile.
            if (request.nextUrl.pathname !== '/') {
                const url = request.nextUrl.clone()
                url.pathname = '/onboarding'
                return NextResponse.redirect(url)
            }
        }
    }

    return supabaseResponse
}
