import { NextResponse } from 'next/server'
import supabase from '@/lib/supabase';

export async function GET(request: Request) {
	// Get URL and code from request
	const { searchParams, origin } = new URL(request.url)
	const code = searchParams.get('code')
	const next = searchParams.get('next') ?? '/'
	const forwardedHost = request.headers.get('x-forwarded-host')

	if (!code) {
		console.error('No code found in URL')
		return NextResponse.redirect(`${origin}`)
	}

	try {
		// Exchange the code for a session
		const { data, error } = await supabase.auth.exchangeCodeForSession(code)

		if (error) {
			console.error('Auth error:', error)
			throw error
		}

		// Successful authentication
		if (data.session) {
			// Use forwarded host if available, otherwise use origin
			const redirectUrl = forwardedHost
				? `https://${forwardedHost}${next}`
				: `${origin}${next}`

			return NextResponse.redirect(redirectUrl, {
				status: 302,
				headers: {
					'Set-Cookie': `session=${data.session.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax`
				}
			})
		}

	} catch (error) {
		console.error('Authentication error:', error)
		return NextResponse.redirect(`${origin}/auth/auth-code-error`, {
			status: 302
		})
	}

	// Fallback redirect for unexpected cases
	return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}