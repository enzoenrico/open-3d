'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import STLViewer from './STLViewer'
import { toast, Toaster } from 'sonner'

export default function UploadPage() {
	const [preview, setPreview] = useState(false)
	const [file, setFile] = useState<File | null>(null)
	const router = useRouter()

	const handleSonner = (desc: string) => {
		console.log('sonning')
		toast("Arquivo recebido", {
			description: desc,
			action: {
				label: ":D",
				onClick: () => { window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank') }
			}
		})
	}

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setFile(event.target.files[0])
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

	return (
		<div className='flex flex-col items-center justify-center min-h-screen py-2 w-screen h-screen'>
			<h1 className='text-3xl font-bold mb-8'>Upload STL File</h1>
			<form onSubmit={handleSubmit} className='w-full max-w-xs h-3/6 flex flex-col items-center justify-center'>
				{
					preview ?
						(
							<div className='h-full flex items-center justify-center'>
								<div className='w-full h-5/6 flex items-center justify-center'>
									<STLViewer />
								</div>
							</div>
						)
						: (
							<Input
								type='file'
								accept='.stl'
								onChange={handleFileChange}
								className='mb-4'
							/>

						)}
				< Button type='submit' disabled={!file} className='w-full'>
					Next
				</Button>
			</form>

			<Toaster theme='dark' />

		</div >
	)
}
