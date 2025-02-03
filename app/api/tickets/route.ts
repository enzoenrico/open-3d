import prisma from "@/lib/prisma";
import { Ticket } from "@prisma/client";
import { NextResponse } from "next/server";

type TnewTicket = {
	material: "PLA" | "ABS"
	tool_temperature: number
	base_temperature: number
	supports: boolean
	file: File | null | undefined
}

export async function GET() {
	try {
		const tickets = await prisma.ticket.findMany()
		return NextResponse.json(tickets)
	} catch (error) {
		console.error('Error fetching tickets:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch tickets' },
			{ status: 500 }
		)
	}
}

export async function POST(req: Request) {
	try {
		const info = await req.json()
		console.log(info)
		try {
			const created_ticket = await prisma.ticket.create({
				data: {
					title: 'dev test',
					authorId: 'dev'
				}
			})

			console.log(created_ticket.id + " created")
			return NextResponse.json(created_ticket)

		} catch (error) {
			console.error('Error creating ticket:', error)
			return NextResponse.json(
				{ error: 'Failed to create ticket' },
				{ status: 500 }
			)
		}
	} catch (error) {
		console.error('Error parsing request:', error)
		return NextResponse.json(
			{ error: 'Invalid request data' },
			{ status: 400 }
		)
	}
}