'use client'

import { motion, AnimatePresence, useTransform, useTime } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import STLViewer from '@/components/STLViewer'
import { toast, Toaster } from 'sonner'
import Typewriter from '@/components/Typewriter'
import { Separator } from '@/components/ui/separator'
import { Rotate3D, Sparkles } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

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
	// for the cool ai rainbow animation
	const [isTyping, setIsTyping] = useState(false)
	// optimize this ^

	const [preview, setPreview] = useState(false)
	const [file, setFile] = useState<File | null>(null)
	const [fileURL, setFileURL] = useState<string>("")
	const router = useRouter()

	const time = useTime()
	const rotate_bg = useTransform(time, [0, 3000], [0, 360], {
		clamp: false
	})

	const rotating_bg = useTransform(rotate_bg, (r) => {
		return `conic-gradient(from ${r}deg, #ff4545, #00ff99, #006aff, #ff0095, #ff4545)`
	})

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
			setTimeout(() => setPreview(true), 750)
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
			setFileURL(url)

			// store file as base64 in localStorage
			const reader = new FileReader()
			reader.onload = () => {
				const base64String = reader.result as string
				// transformar em array buffer de novo
				localStorage.setItem('open-3d_file-data', base64String)
				localStorage.setItem('open-3d_file-name', f.name)
				localStorage.setItem('open-3d_file-type', f.type)
				console.log(`Stored file ${f.name} in localStorage`)
			}
			reader.onerror = (error) => {
				console.error('Error reading file:', error)
			}
			reader.readAsDataURL(f)

			console.log(`Created temporary URL ${url} for current page`)
		} else {
			console.log("no file provided")
		}
	}

	return (
		<div className='flex flex-row max-md:flex-col items-center justify-evenly gap-2 w-screen h-screen'>
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
									<STLViewer fileUrl={fileURL} />
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
					<h1 className='text-3xl font-bold'>Decreva seu modelo </h1>
					<p className='text-md  text-slate-700'>Um de nossos profissionais entrará em contato para uma cotação</p>
				</div>
				<form className='h-1/5 flex flex-col items-center justify-center'>
					{/* fix later */}
					<div className='flex gap-2'>


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
									<Button>
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
