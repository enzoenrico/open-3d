import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { FileProvider } from '@/contexts/FileContext/provider'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
})

export const metadata: Metadata = {
	title: 'Open3D',
	description: '3D printing utility created for PUCPR',
	authors: [{ name: 'Enzo Enrico Boteon Chiuratto', url: 'https://kyou.tech' }]
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{/* for the 3d files */}
				<FileProvider>
					{children}
				</FileProvider>
			</body>
		</html>
	)
}
