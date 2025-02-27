'use client'

import { ReactNode, useState } from "react"
import { FileContext } from "./context"

interface FileProviderProps {
	children: ReactNode
}

export function FileProvider({ children }: FileProviderProps) {
	const [file, setFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)

	return (
		<FileContext.Provider
			value={{
				file,
				setFile,
				previewUrl,
				setPreviewUrl
			}}
		>
			{children}
		</FileContext.Provider>
	)
}