import { createContext } from "react"

interface FileContextType {
	file: File | null
	setFile: (file: File | null) => void
	previewUrl: string | null
	setPreviewUrl: (url: string | null) => void
}

export const FileContext = createContext<FileContextType>({
	file: null,
	setFile: () => { },
	previewUrl: null,
	setPreviewUrl() { },
})