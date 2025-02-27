import { User, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import supabase from '@/lib/supabase'

export function handleGoogleSignIn(sessionValid: boolean, user: User) {
	return async () => {
		if (!sessionValid || !user) {
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: `${window.location.origin}/api/auth/callback`,
					queryParams: {
						access_type: 'offline',
						next: '/upload',
						prompt: 'consent'
					}
				}
			})
			if (error) {
				console.error('Erro autenticando | ', error.message)
			}
		}
	}
}