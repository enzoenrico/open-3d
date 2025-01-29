import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
	const tickets = await prisma.ticket.findMany()
	return NextResponse.json(tickets)
	return NextResponse.json({ message: "hi" })
}

type TnewTicket = {
	material: "PLA" | "ABS"
	tool_temperature: number
	base_temperature: number
	supports: boolean
	file: File | null | undefined
}

export async function POST(req: Request) {
	try {
		const info = await req.json() as TnewTicket
		console.log(info)
		try {
			const created_ticket = await prisma.ticket.create({
				data: {
					title: 'test',
					description: info.material,
					userId: '0'
				}
			})

		} catch (err) {
			console.error("Error occured", err)
		}

		return NextResponse.json({ message: info, status: 200 })
	} catch (err) {
		return NextResponse.json({ message: "error", error: err, status: 500 })
	}
}