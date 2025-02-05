"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { useContext, useEffect, useRef, useState } from 'react'
import { toast, Toaster } from "sonner"
import { motion, AnimatePresence, useTime, useTransform } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import STLViewer from "@/components/STLViewer"
import { fileURLToPath } from "url"
import { FileContext } from "@/contexts/FileContext/context"


type FormSchema = {
	material: "PLA" | "ABS"
	tool_temperature: number
	base_temperature: number
	supports: boolean
}

const defaultValues: FormSchema = {
	material: "PLA",
	tool_temperature: 200,
	base_temperature: 60,
	supports: true
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
	const [material, setMaterial] = useState<string>("")
	const [extruderTemp, setExtruderTemp] = useState<string>("")
	const [baseTemp, setBaseTemp] = useState<string>("")
	const [supports, setSupports] = useState(false)
	const [comments, setComments] = useState<string>("")

	const [isHovered, setIsHovered] = useState<boolean>(false)

	const { previewUrl } = useContext(FileContext)

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
	}, [])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!material || !extruderTemp || !baseTemp || supports === undefined) {
			toast("Erro!", {
				description: "Por favor, preencha todos os campos, ou clique no botão para preencher automaticamente",
				action: {
					label: "Preencher",
					onClick: () => { _autofill_settings() }
				},
			})
			return
		}
		const return_data = await fetch("http://localhost:3000/api/tickets", {
			method: "POST",
			body: JSON.stringify({
				material: material,
				tool_temperature: extruderTemp,
				base_temperature: baseTemp,
			}),
		})
		console.log(return_data)
		const d_json = await return_data.json()
		console.log(d_json)
		toast(
			"Details successfully sent!")
	}

	const _autofill_settings = () => {
		setMaterial(defaultValues.material)
		setTimeout(() => { setExtruderTemp(defaultValues.tool_temperature.toString()) }, 500)
		setTimeout(() => { setBaseTemp(defaultValues.base_temperature.toString()) }, 800)
		setTimeout(() => { setSupports(defaultValues.supports) }, 1000)
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
										<SelectValue placeholder="Material da impressão" />
									</motion.div>
								</AnimatePresence>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="PLA">PLA</SelectItem>
								<SelectItem value="ABS">ABS</SelectItem>
							</SelectContent>
						</Select>
						<Select value={extruderTemp} onValueChange={setExtruderTemp}>
							<SelectTrigger className="w-3/5">
								<AnimatePresence mode="wait">
									<motion.div
										key={extruderTemp || "placeholder"}
										variants={valueVariants}
										initial="initial"
										animate="animate"
										exit="exit"
									>
										<SelectValue placeholder="Temperatura do extrusor" />
									</motion.div>
								</AnimatePresence>
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="200">200</SelectItem>
								<SelectItem value="220">220</SelectItem>
							</SelectContent>
						</Select>

						<Select value={baseTemp} onValueChange={setBaseTemp}>
							<SelectTrigger className="w-3/5">
								<AnimatePresence mode="wait">
									<motion.div
										key={baseTemp || "placeholder"}
										variants={valueVariants}
										initial="initial"
										animate="animate"
										exit="exit"
									>
										<SelectValue placeholder="Temperatura da base" />
									</motion.div>
								</AnimatePresence>
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="60">60</SelectItem>
								<SelectItem value="100">100</SelectItem>
							</SelectContent>
						</Select>

						<div className="flex items-center space-x-2">
							<Checkbox
								checked={supports}
								onCheckedChange={(checked) => setSupports(checked as boolean)}
							/>
							<Label className="text-md font-normal">Suportes?</Label>
						</div>
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
							className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 z-10"
						>
							Confirmar
						</Button>
					</div>
				</form>
			</div>
			<Toaster />
		</div>
	)
}
