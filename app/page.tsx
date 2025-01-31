"use client"
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent } from '@/components/ui/hover-card'
import { HoverCardTrigger } from '@radix-ui/react-hover-card'
import Image from 'next/image'
import { motion, AnimatePresence } from "framer-motion"
import Link from 'next/link'
import Typewriter from '@/components/Typewriter'

export default function Home() {
	return (
		<div className='w-screen h-screen flex flex-col justify-between'>
			<div className=' h-5/6 flex flex-col items-center justify-center gap-4'>
				<Image
					src={'/penguin.gif'}
					width={50}
					height={50}
					alt='Spinning penguin'
				/>
				{/* <h1 className='font-bold text-6xl'>Open-3d</h1> */}
				<Typewriter text="Open-3d" styling='font-bold text-6xl' />
				<h3 className='text-2xl'>Por estudantes, para estudantes</h3>
				<Link href={'/upload'}>
					<Button variant={'default'} className='w-40 h-10'>
						Iniciar
					</Button>
				</Link>
			</div>
			<div className='flex w-full items-center justify-center mb-4'>
				<span className='flex gap-2'> Made with <motion.div
					animate={{
						scale: [1, 1.1, 1],
						transition: {
							duration: 1.5,
							repeat: Infinity,
							ease: "easeInOut"
						}
					}}
				>❤️</motion.div> by</span>
				<HoverCard>
					<HoverCardTrigger asChild>
						<Button variant={'link'} className='text-blue-600'>
							@ky0uko___
						</Button>
					</HoverCardTrigger>
					<HoverCardContent>
						<div className='flex justify-between space-x-4'>
							<Avatar>
								<AvatarImage src='/ky0uko_pfp.JPG' className='object-cover' />
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
		</div>
	)
}
