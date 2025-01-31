'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import STLViewer from '@/components/STLViewer'
import { toast, Toaster } from 'sonner'
import Typewriter from '@/components/Typewriter'

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
	const [preview, setPreview] = useState(false)
	const [file, setFile] = useState<File | null>(null)
	const [fileURL, setFileURL] = useState<string>("")
	const router = useRouter()


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
		<div className='flex flex-col items-center justify-center min-h-screen py-2 w-screen h-screen'>
			<h1 className='text-3xl font-bold mb-8'>Upload STL File</h1>
			<form onSubmit={handleSubmit} className='w-full max-w-xs h-3/6 flex flex-col items-center justify-center'>
				<AnimatePresence mode="wait">
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
								className='w-full h-5/6 flex items-center justify-center'
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
							/>
						</motion.div>
					)}
				</AnimatePresence>
				< Button type='submit' disabled={!file} className='w-full'>
					Next
				</Button>
			</form>

			<Toaster theme='dark' />

		</div >
	)
}
