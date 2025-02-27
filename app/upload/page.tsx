'use client'

import { motion, AnimatePresence, useTransform, useTime } from 'framer-motion'
import { useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import STLViewer from '@/components/STLViewer'
import { toast, Toaster } from 'sonner'
import Typewriter from '@/components/Typewriter'
import { Separator } from '@/components/ui/separator'
import { Rotate3D, Sparkles } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { FileContext } from '@/contexts/FileContext/context'
import UserCard from '@/components/user-card'
import supabase from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useRainbowBackground } from '@/components/rainbow-bg'

const variants = {
	enter: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.2, ease: "easeOut" }
	},
	exit: {
		opacity: 0,
		y: 20,
		transition: { duration: 0.5, ease: "easeInOut" }
	}
}


export default function UploadPage() {
	const handleAI = (e) => {
		e.preventDefault()
		toast("Essa feature ainda não está completa!", {
			description: 'Aguarde nossa próxima atualização para poder pedir modelos'
		})
	}


	const [user, setUser] = useState<User | null>(null)
	useEffect(() => {
		const check_cookie = async () => {
			const { data: { session } } = await supabase.auth.getSession()
			if (session) {
				setUser(session.user)
				if (session.user.user_metadata) {
					toast("Bem vindo " + session.user.user_metadata.full_name.split(' ')[0], {
						description: 'Bem vindo ao Open3D!',
						duration: 1000
					})
				}
				// console.log(user.aud)
			}
		}
		check_cookie()
	}, [])


	// for the cool ai rainbow animation
	const [isTyping, setIsTyping] = useState(false)
	// optimize this ^

	const [preview, setPreview] = useState(false)
	const router = useRouter()

	// file context
	const { setFile, setPreviewUrl, file, previewUrl } = useContext(FileContext)

	const rotating_bg = useRainbowBackground()

	const handleSonner = (desc: string) => {
		toast("Arquivo recebido", {
			description: desc,
			action: {
				label: ":D",
				onClick: () => { window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank') }
			},
		})
	}

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setFile(event.target.files[0])

			// creates the file url for showing the model
			handleURLCreation(event.target.files[0])
			handleSonner("Arquivo enviado com sucesso")
		}
	}

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		if (file) {
			router.push('/details')
		}
	}

	const handleURLCreation = (f: File) => {
		if (f) {
			const url = URL.createObjectURL(f)
			setPreviewUrl(url)
			console.log(`Created temporary URL ${url} for current page`)
		} else {
			console.log("no file provided")
		}
	}

	return (
		<div className='flex flex-row max-md:flex-col items-center justify-evenly gap-4 w-screen h-screen'>
			<div className='absolute top-4 left-4 w-1/6 '>
				<UserCard userObj={user} />
			</div>
			<div className='flex flex-col items-center justify-center gap-4 w-1/2 h-full max-md:h-1/2'>
				<AnimatePresence >
					<div className='flex flex-col justify-start gap-1'>
						<h1 className='text-3xl font-bold'>Insira seu arquivo aqui</h1>
						<p className='text-md  text-slate-700'>Apenas arquivos .stl suportados no momento</p>
					</div>
					<form onSubmit={handleSubmit} className={`w-full max-w-xs ${preview ? `h-3/5` : `h-1/5`} gap-2 flex flex-col items-center justify-center`}>
						{preview ? (
							<motion.div
								key="preview"
								initial={{ opacity: 0, y: 20 }}
								animate="enter"
								exit="exit"
								variants={variants}
								className='h-full flex items-center justify-center'
							>
								<div
									className='w-full h-full flex items-center justify-center p-2'
								>
									<STLViewer fileUrl={previewUrl} />
								</div>
							</motion.div>
						) : (
							<motion.div
								key="input"
								initial={{ opacity: 0, y: 20 }}
								animate="enter"
								exit="exit"
								variants={variants}
							>
								<Input
									type='file'
									accept='.stl'
									onChange={handleFileChange}
									className='mb-4'
									placeholder='Insira seu arquivo aqui'
								/>
							</motion.div>
						)}
						< Button type='submit' disabled={!file} className='w-full'>
							Next
						</Button>
					</form>



				</AnimatePresence>
			</div>

			<Separator orientation={window.innerWidth > 768 ? "vertical" : "horizontal"} className="h-3/4  max-md:w-3/4 max-md:h-[1px]" />

			{/* helpdesk */}
			<div className='flex flex-col items-center justify-center gap-4 w-1/2 max-md:h-1/2 h-full'>
				<div className='flex flex-col justify-start gap-1'>
					<h1 className='text-3xl font-bold text-center'>Decreva seu modelo </h1>
					<p className='text-md  text-slate-700 text-center'>Um de nossos designers entrará em contato para uma cotação</p>
				</div>
				<form className='h-1/5 w-full flex flex-col items-center justify-center'>
					{/* fix later */}
					<div className='flex justify-center items-center gap-2'>
						<div className='flex gap-2 relative items-center justify-center'>
							<AnimatePresence mode="wait">
								{isTyping && (
									<motion.div
										key="gradient"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.3, ease: 'easeInOut' }}
										className='absolute -inset-1 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-lg opacity-75 blur-sm'
										style={{ background: rotating_bg }}
									/>
								)}
							</AnimatePresence>
							<motion.div
								key="input"
								initial={{ opacity: 1 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 1 }}
							>
								<Input
									type="text"
									placeholder='Descreva seu modelo'
									className='relative flex items-center justify-center z-10 bg-white rounded-md focus:border-none'
									onFocus={() => setIsTyping(true)}
									onBlur={(e) => setIsTyping(false)}
								/>
							</motion.div>

						</div>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Button onClick={handleAI}>
										<Sparkles className="animate-colors " />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									{/*  TODO: add the ai chat builder */}
									<p>Coming soon...</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				</form>
			</div>
			<Toaster theme='dark' />
		</div >
	)
}