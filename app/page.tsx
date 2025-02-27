"use client"
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent } from '@/components/ui/hover-card'
import { HoverCardTrigger } from '@radix-ui/react-hover-card'
import Image from 'next/image'
import { motion, AnimatePresence } from "framer-motion"
import Link from 'next/link'
import Typewriter from '@/components/Typewriter'
import supabase from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { toast, Toaster } from 'sonner'
import { handleGoogleSignIn } from '@/hooks/useGoogleSignIn'


export default function Home() {
	const [sessionValid, setValidity] = useState(false)
	const [user, setUser] = useState<User | null>(null)
	const signInWithGoogle = handleGoogleSignIn(sessionValid, user)

	useEffect(() => {
		const check_cookie = async () => {
			const { data: { session } } = await supabase.auth.getSession()
			if (session) {
				setValidity(true)
				setUser(session.user)
				if (session.user.user_metadata) {
					toast("Bem vindo " + session.user.user_metadata.full_name.split(' ')[0], {
						description: 'Bem vindo ao Open3D!',
						duration: 1000
					})
				}
			}
		}
		check_cookie()
	}, [])

	return (
		<div className='w-screen h-screen flex flex-col justify-between'>
			<div className=' h-5/6 flex flex-col items-center justify-center gap-4'>
				<Image
					src={'/penguin.gif'}
					width={50}
					height={50}
					alt='Spinning penguin'
				/>
				<Typewriter text="Open-3d" styling='font-bold text-6xl' />
				<h3 className='text-2xl'>Por estudantes, para estudantes</h3>
				<Link href={'/upload'}>
					<Button variant={sessionValid ? 'default' : 'destructive'} className='w-40 h-10'
						onClick={signInWithGoogle}
					>
						Iniciar
					</Button>
				</Link>
			</div>
			<div className='flex w-full items-center justify-center mb-4'>
				<span className='flex gap-2'>
					Made with
					<motion.div
						animate={{
							scale: [1, 1.1, 1],
							transition: {
								duration: 1.5,
								times: [0, 0.2, 1],
								repeat: Infinity,
								ease: "easeInOut"
							}
						}}
					>
						❤️
					</motion.div>
					by</span>
				<HoverCard>
					<HoverCardTrigger asChild>
						<Button variant={'link'} className='text-blue-600'>
							@ky0uko___
						</Button>
					</HoverCardTrigger>
					<HoverCardContent>
						<div className='flex justify-between space-x-4'>
							<Avatar>
								<AvatarImage src='/ky0uko_pfp.jpg' className='object-cover' />
								{/* <AvatarImage src={user ? user.user_metadata.picture : '/ky0uko_pfp.JPG'} className='object-cover' /> */}
							</Avatar>
							<div className='space-y-1'>
								<Link
									href={'https://kyou.tech'}
									className='hover:text-blue-600'
								>
									<h4 className='text-sm font-semibold'>@ky0uko___</h4>
								</Link>
								<p className='text-sm'>Estudante de BSI, Dev, Nerd</p>
							</div>
						</div>
					</HoverCardContent>
				</HoverCard>
			</div>
			<Toaster theme='dark' />
		</div>
	)
}


