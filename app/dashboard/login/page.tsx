"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import UserCard from "@/components/user-card"

import { useEffect, useState } from "react"

import supabase from "@/lib/supabase"
import { User } from "@supabase/supabase-js"

import { FcGoogle } from 'react-icons/fc'
import { handleGoogleSignIn } from "@/hooks/useGoogleSignIn"


export default function Login() {
	const [user, setUser] = useState<User | null>(null)
	const [sessionValid, setValidity] = useState(false)

	const handleAuth = handleGoogleSignIn(sessionValid, user)

	useEffect(() => {
		const check_cookie = async () => {
			const { data: { session } } = await supabase.auth.getSession()
			if (session) {
				setUser(session.user)
			}
		}
		check_cookie()
	}, [user, sessionValid])
	return (
		<div className="w-screen h-screen flex items-center justify-center" >
			<div className="w-[350px] space-y-4">
				<Card className="flex flex-col items-center justify-center">
					<CardHeader>
						<CardTitle>Login</CardTitle>
						<CardDescription>Enter your credentials to access the dashboard</CardDescription>
					</CardHeader>
					{user || sessionValid ?
						(
							<CardContent className="space-y-4 w-full">
								<UserCard userObj={user} showPopover={false} defaultOpen={true} />
							</CardContent>
						)
						:
						(
							<CardContent className="rounded-full flex items-center justify-center p-2">
								<Button variant="default" className="text-md rounded-full" onClick={handleAuth} >
									<FcGoogle className="w-8 h-8 mr-2" /> Fazer login com conta google
								</Button>
							</CardContent>
						)
					}
				</Card>
			</div>
		</div >
	)
}