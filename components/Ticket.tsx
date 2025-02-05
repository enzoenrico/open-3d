"use client"
import { Ticket } from "@prisma/client"

interface TicketProps {
	ticket: Ticket
}

export default function Ticket({ ticket }: TicketProps) {
	return (
		<Card
			key={ticket.id}
			className={`cursor-pointer ${selectedTicket?.id === ticket.id ? 'border-primary' : ''}`}
			onClick={() => setSelectedTicket(ticket)}
		>
			<CardHeader className="p-4 pb-2">
				<div className="flex justify-between items-center">
					<span className="font-semibold">{ticket.title}</span>

					<Badge variant={priorityVariants[ticket.priority]}>
						{ticket.priority}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="p-4 pt-0">
				<p className="text-sm text-gray-600">{ticket.subject}</p>
				<div className="flex justify-between items-center mt-2">
					<Badge variant={statusVariants[ticket.status]}>
						{ticket.status}
					</Badge>
					<span className="text-xs text-gray-500">{ticket.created}</span>
				</div>
			</CardContent>
		</Card>
	)
}
