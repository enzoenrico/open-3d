"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useContext, useEffect, useRef, useState } from 'react'
import { toast, Toaster } from "sonner"
import { motion, AnimatePresence, useTime, useTransform } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import STLViewer from "@/components/STLViewer"
import { FileContext } from "@/contexts/FileContext/context"
import { Colors, Materials, PrintInfo, Ticket } from "@prisma/client"
import Counter from "@/components/Counter"
import { LucideMinusCircle, LucidePlusCircle, PlusCircleIcon } from "lucide-react"
import { useRouter } from "next/navigation"

type FormSchema = {
	color: Colors
	material: Materials
	size: [number, number, number]
	comments: string | null
}

const defaultValues: FormSchema = {
	color: "WHITE",
	material: "PLA",
	size: [10, 10, 10],
	comments: null
}



const valueVariants = {
	initial: {
		y: 10,
		opacity: 0
	},
	animate: {
		y: 0,
		opacity: 1,
		transition: {
			type: "spring",
			stiffness: 300,
			damping: 25
		}
	},
	exit: {
		y: -10,
		opacity: 0,
		transition: {
			duration: 0.1
		}
	}
}

export default function DetailsPage() {
	const [color, setColor] = useState<Colors | null>();
	const [material, setMaterial] = useState<Materials | null>();
	const [size, setSize] = useState<[number, number, number] | null>([0, 0, 0]);
	const [comments, setComments] = useState<string | null>();

	const [isHovered, setIsHovered] = useState<boolean>(false)

	const { previewUrl, file } = useContext(FileContext)

	const router = useRouter()

	// gradient animations
	const time = useTime()
	const rotate_bg = useTransform(time, [0, 3000], [0, 360], {
		clamp: false
	})

	const rotating_bg = useTransform(rotate_bg, (r) => {
		return `conic-gradient(from ${r}deg, #ff4545, #00ff99, #006aff, #ff0095, #ff4545)`
	})


	useEffect(() => {
		// change
		if (!previewUrl || previewUrl == "") {
			toast("Arquivo não encontrado", {
				description: "Sinto muito nosso dev é meio burro"
			})
			return
		}
		// setFileUrl(url)
		toast("Arquivo carregado com sucesso!", {
			description: "╰(*°▽°*)╯"
		})
	}, [previewUrl])
	const create_printInfo_entry = async () => {
		const printInfo: PrintInfo = {
			color: color,
			material: material,
			sizeX: size[0],
			sizeY: size[1],
			sizeZ: size[2],
		}

		var print_info_id = ""
		try {
			const r = await fetch('/api/print_info',
				{
					method: "POST",
					body: JSON.stringify(printInfo)
				}
			)
			const r_json = await r.json()
			print_info_id = r_json.message
		} catch (error) {
			throw Error(error)
		}
		return print_info_id
	}

	const create_file_entry = async () => {
		return
	}


	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!file || previewUrl == '') {
			toast("Erro!", {
				description: "Arquivo não encontrado, volte para a página anterior e adicione o arquivo que deseja imprimir",
				action: {
					label: "Adicionar arquivo",
					onClick: () => { router.replace('/upload') }
				},
			})
			return
		}
		if (!material || !color || !size || size.some(e => e === 0)) {
			toast("Erro!", {
				description: "Por favor, preencha todos os campos, ou clique no botão para preencher automaticamente",
				action: {
					label: "Preencher",
					onClick: () => { _autofill_settings() }
				},
			})
			return
		}

		const p_id = await create_printInfo_entry()

		const new_ticket: Ticket | Record<string, any> = {
			title: file.name,
			description: comments || "no description provided",
			printInfoId: p_id || '',
			status: "OPEN",
			authorId: 'dev',
		}

		// needs refactoring
		const return_data = await fetch("http://localhost:3000/api/tickets", {
			method: "POST",
			body: JSON.stringify(new_ticket),
		})
		const d_json = await return_data.json()
		console.log(d_json)

		// add a popup on middle of screen showing created ticket
		// or a OK confirmation message
		toast("Details successfully sent!")
	}

	const _autofill_settings = () => {
		setColor(defaultValues.color)
		setTimeout(() => { setMaterial(defaultValues.material) }, 500)
		setTimeout(() => { setSize(defaultValues.size) }, 800)
		return
	}

	return (
		<div className="w-screen h-screen flex flex-col items-center justify-center gap-4">
			<div className="flex flex-col items-center p-8">
				<h1 className="text-4xl font-bold text-center">Adicione as instruções para impressão</h1>
				<h3 className=" text-gray-600">Caso não saiba como escolher, clique <u id="autofill" className="text-blue-500 hover:text-blue-800 cursor-pointer " onClick={_autofill_settings}>aqui</u></h3>
			</div>

			{/* is using fallback model, fix it later */}
			<div className="flex max-sm:flex-col items-center justify-evenly h-1/2 w-full ">
				{
					previewUrl ?
						(
							<div className="w-full h-full p-4">
								<STLViewer fileUrl={previewUrl} />
							</div>
						) : (
							<p className="w-full h-full flex items-center justify-center italic animate-pulse">
								loading...
							</p>
						)
				}

				<form className="flex flex-col items-center justify-center gap-6 w-4/5 p-4">
					<div className="flex flex-col items-center gap-4 w-full">
						<Select value={color} onValueChange={setColor}>
							<SelectTrigger className="w-3/5">
								<AnimatePresence mode="wait">
									<motion.div
										key={color || "placeholder"}
										variants={valueVariants}
										initial="initial"
										animate="animate"
										exit="exit"
									>
										<SelectValue placeholder="Cor" />
									</motion.div>
								</AnimatePresence>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="WHITE">Branco</SelectItem>
								<SelectItem value="BLACK">Preto</SelectItem>
								<SelectItem value="GREEN">Verde</SelectItem>
								<SelectItem value="BLUE">Azul</SelectItem>
								<SelectItem value="PURPLE">Roxo</SelectItem>
								<SelectItem value="RED">Vermelho</SelectItem>
								<SelectItem value="PINK">Rosa</SelectItem>
							</SelectContent>
						</Select>

						<Select value={material} onValueChange={setMaterial}>
							<SelectTrigger className="w-3/5">
								<AnimatePresence mode="wait">
									<motion.div
										key={material || "placeholder"}
										variants={valueVariants}
										initial="initial"
										animate="animate"
										exit="exit"
									>
										<SelectValue placeholder="Material" />
									</motion.div>
								</AnimatePresence>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="PLA">PLA</SelectItem>
								<SelectItem value="ABS">ABS</SelectItem>
							</SelectContent>
						</Select>

						<div className="flex gap-2 w-3/5">
							{/* implement apple numbers animation  */}
							<Input
								type="number"
								placeholder="Largura"
								value={size?.[0]}
								onChange={(e) => setSize(prev => [Number(e.target.value), prev?.[1] ?? 0, prev?.[2] ?? 0])}
							/>
							<Input
								type="number"
								placeholder="Altura"
								value={size?.[1]}
								onChange={(e) => setSize(prev => [prev?.[0] ?? 0, Number(e.target.value), prev?.[2] ?? 0])}
							/>
							<Input
								type="number"
								placeholder="Profundidade"
								value={size?.[2]}
								onChange={(e) => setSize(prev => [prev?.[0] ?? 0, prev?.[1] ?? 0, Number(e.target.value)])}
							/>
						</div>

						{/* <div className="flex flex-col items-center justify-center">
							<div className="flex flex-col gap-4">
								<div className="flex justify-around items-center gap-2">
									<LucideMinusCircle
										className="cursor-pointer"
										onClick={() => setSize(prev => [Math.max(0, (prev?.[0] ?? 0) - 1), prev?.[1] ?? 0, prev?.[2] ?? 0])}
									/>
									<Counter value={size?.[0] ?? 0} />
									<LucidePlusCircle
										className="cursor-pointer"
										onClick={() => setSize(prev => [(prev?.[0] ?? 0) + 1, prev?.[1] ?? 0, prev?.[2] ?? 0])}
									/>
								</div>
								<div className="flex justify-evenly items-center gap-2">
									<LucideMinusCircle
										className="cursor-pointer"
										onClick={() => setSize(prev => [prev?.[0] ?? 0, Math.max(0, (prev?.[1] ?? 0) - 1), prev?.[2] ?? 0])}
									/>
									<Counter value={size?.[1] ?? 0} />
									<LucidePlusCircle
										className="cursor-pointer"
										onClick={() => setSize(prev => [prev?.[0] ?? 0, (prev?.[1] ?? 0) + 1, prev?.[2] ?? 0])}
									/>
								</div>
								<div className="flex justify-evenly items-center gap-2">
									<LucideMinusCircle
										className="cursor-pointer"
										onClick={() => setSize(prev => [prev?.[0] ?? 0, prev?.[1] ?? 0, Math.max(0, (prev?.[2] ?? 0) - 1)])}
									/>
									<Counter value={size?.[2] ?? 0} />
									<LucidePlusCircle
										className="cursor-pointer"
										onClick={() => setSize(prev => [prev?.[0] ?? 0, prev?.[1] ?? 0, (prev?.[2] ?? 0) + 1])}
									/>
								</div>
							</div>
						</div>*/}

						<Textarea
							className="w-3/5"
							placeholder="Comentários adicionais"
							value={comments ?? ''}
							onChange={(e) => setComments(e.target.value)}
						/>
					</div>

					<div className="relative flex items-center justify-center">
						{/* Using AnimatePresence for proper enter/exit animations */}
						<AnimatePresence>
							{isHovered && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1, transition: { duration: 0.3, ease: 'easeInOut' } }}
									exit={{ opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } }}
									className='absolute -inset-1 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-lg opacity-75 blur-sm'
									style={{ background: rotating_bg }}
								/>
							)}
						</AnimatePresence>
						<Button
							// type="submit"
							onClick={handleSubmit}
							onMouseEnter={() => setIsHovered(true)}
							onMouseLeave={() => setIsHovered(false)}
							className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-slate-800 z-10"
						>
							Confirmar
						</Button>
					</div>
				</form>
			</div >
			<Toaster theme="dark" />
		</div >
	)
}
