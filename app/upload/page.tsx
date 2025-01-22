'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import STLViewer from './STLViewer'

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null)
    const router = useRouter()

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0])
            router.push('/details')
        }
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        if (file) {
            router.push('/print-instructions')
        }
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen py-2'>
            <h1 className='text-3xl font-bold mb-8'>Upload STL File</h1>
            <form onSubmit={handleSubmit} className='w-full max-w-xs'>
                <Input
                    type='file'
                    accept='.stl'
                    onChange={handleFileChange}
                    className='mb-4'
                />
                <Button type='submit' disabled={!file} className='w-full'>
                    Next
                </Button>
            </form>
            {file && (
                <div className='mt-8 w-full max-w-md h-64'>
                    {/* <STLViewer file={file} /> */}
                    imagina um stl viewer aqui
                </div>
            )}
        </div>
    )
}
