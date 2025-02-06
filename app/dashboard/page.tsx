"use client"
import React, { useEffect, useState } from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer
} from 'recharts';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import STLViewer from '@/components/STLViewer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowDownIcon, Loader } from 'lucide-react';
import { Ticket, TicketStatus } from '@prisma/client';
import { toast, Toaster } from 'sonner';

// Mock data for tickets and graph
const mockTicketGraphData = [
	{ month: 'Jan', opened: 40, resolved: 30 },
	{ month: 'Feb', opened: 35, resolved: 38 },
	{ month: 'Mar', opened: 50, resolved: 45 },
	{ month: 'Apr', opened: 45, resolved: 42 },
	{ month: 'May', opened: 55, resolved: 50 },
];


const Dashboard = () => {
	const [tickets, setTickets] = useState<Ticket[]>([]);
	const [selectedTicket, setSelectedTicket] = useState(tickets[0]);
	const [isLoading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		const fetchTickets = async () => {
			setLoading(true)
			try {
				const t = await fetch('/api/tickets', {
					method: "GET"
				})
				const t_json: Ticket[] = await t.json()
				if (t_json.length < 1) {
					console.error('empty ticket array')
					throw new Error("Empty cards returned")
				}

				// sort by latest
				setTickets(t_json.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
				console.log(t_json)
				setLoading(false)
			} catch (error) {
				console.error(error)
				toast("Erro carregando tickets...", {
					description: error
				})
			} finally {
				setLoading(false)
			}
		}
		fetchTickets()
		// console.log(tickets)
	}, [])


	const statusVariants: Record<TicketStatus, string> = {
		"OPEN": "default",
		"IN_PROGRESS": "secondary",
		"RESOLVED": "success",
		"CLOSED": "outline"
	};

	const handleTicketUpdate = (ticket) => {
		// Placeholder for ticket update logic
		console.log("Updating ticket:", ticket);
		setTickets(tickets.map(t => t.id === ticket.id ? ticket : t));
	};

	const saveChanges = () => {
		// change the specific selected ticket
		return
	}

	const handleLogout = () => {
		// Implement logout logic
		console.log("Logging out");
	};

	return (
		<div className="flex min-h-screen bg-gray-50">
			{/* Sidebar with Ticket Table */}
			<div className="w-1/3 border-r overflow-y-hidden h-screen p-6 bg-white">
				<div className="flex justify-between items-center mb-4 ">
					<h2 className="text-xl font-bold text-gray-800">Tickets</h2>
				</div>
				<div className="h-full overflow-y-scroll">
					{/* change to standalone component */}
					<div className='space-y-2'>
						{!isLoading || tickets.length >= 1 ?
							(tickets.map((this_ticket) => (
								<Card
									key={this_ticket.id}
									className={`cursor-pointer ${selectedTicket?.id === this_ticket.id ? 'border-primary' : ''}`}
									onClick={() => setSelectedTicket(this_ticket)}
								>
									<CardHeader className="p-4 pb-2">
										<div className="flex justify-between items-center">
											<span className="font-semibold">{this_ticket.title}</span>
										</div>
									</CardHeader>
									<CardContent className="p-4 pt-0">
										<p className="text-sm text-gray-600 max-w-full text-ellipsis overflow-hidden">{this_ticket.description}</p>
										<div className="flex justify-between items-center mt-2">
											<Badge variant={statusVariants[this_ticket.status]}>
												{this_ticket.status}
											</Badge>
											<span className="text-xs text-gray-500">{this_ticket.created}</span>
										</div>
									</CardContent>
								</Card>


							)))
							: (
								<div className='h-full w-full flex items-center justify-center'>
									<Loader className='animate-spin' />
								</div>
							)
						}
					</div>
				</div>
			</div>

			{/* Main Content Area */}
			<div className="w-2/3 p-6 space-y-2 h-screen overflow-y-scroll">
				{/* User Profile and Logout */}
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-bold text-gray-800">Ticket Dashboard</h1>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="relative h-8 w-8 rounded-full">
								<Avatar className="h-8 w-8">
									<AvatarImage src="/placeholder-user.jpg" alt="User avatar" />
									<AvatarFallback>UN</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56" align="end" forceMount>
							<DropdownMenuLabel className="font-normal">
								<div className="flex flex-col space-y-1">
									<p className="text-sm font-medium leading-none">User Name</p>
									<p className="text-xs leading-none text-muted-foreground">
										support@example.com
									</p>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="mr-2 h-4 w-4"
								>
									<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
									<circle cx="12" cy="7" r="4" />
								</svg>
								<span>Profile</span>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={handleLogout}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="mr-2 h-4 w-4"
								>
									<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
									<polyline points="16 17 21 12 16 7" />
									<line x1="21" x2="9" y1="12" y2="12" />
								</svg>
								<span>Log out</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<Collapsible>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center justify-around'>
								<p className='w-3/4'>Ticket Metrics</p>
								<CollapsibleTrigger>
									{/* <Button variant='ghost'> */}
									<ArrowDownIcon />
									{/* </Button> */}
								</CollapsibleTrigger>
							</CardTitle>
						</CardHeader>
						<CollapsibleContent>
							<CardContent className="h-64">
								<ResponsiveContainer width="100%" height="100%">
									<LineChart data={mockTicketGraphData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="month" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Line type="monotone" dataKey="opened" stroke="#8884d8" activeDot={{ r: 8 }} />
										<Line type="monotone" dataKey="resolved" stroke="#82ca9d" />
									</LineChart>
								</ResponsiveContainer>
							</CardContent>
						</CollapsibleContent>
					</Card>
				</Collapsible>

				{selectedTicket && (
					<div className="flex flex-col gap-2 w-full">
						<Collapsible>
							<Card>
								<CardHeader>
									<CardTitle className='flex items-center justify-around'>
										<p className='w-3/4'>3D model</p>
										<CollapsibleTrigger>
											{/* <Button variant='ghost'> */}
											<ArrowDownIcon />
											{/* </Button> */}
										</CollapsibleTrigger>
									</CardTitle>
								</CardHeader>
								<CollapsibleContent >
									<CardContent className="w-full h-full">
										<STLViewer fileUrl="" />
									</CardContent>
								</CollapsibleContent>
							</Card>
						</Collapsible>
						{/* Ticket Information */}
						<Card>
							<CardHeader>
								<CardTitle>Ticket Details: {selectedTicket.id}</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid gap-4">
									<div className="flex gap-4">
										<div>
											<span className="font-medium">Status:</span>
											<Select
												defaultValue={selectedTicket.status}
												onValueChange={(value) => {
													const updatedTicket = { ...selectedTicket, status: value };
													handleTicketUpdate(updatedTicket);
												}}
											>
												<SelectTrigger className="w-[180px] ml-2">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="OPEN">Open</SelectItem>
													<SelectItem value="IN_PROGRESS">In Progress</SelectItem>
													<SelectItem value="RESOLVED">Resolved</SelectItem>
													<SelectItem value="CLOSED">Closed</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>
									<div>
										<span className="font-medium">Description:</span>
										<p>{selectedTicket.description}</p>
									</div>
									<div className="flex justify-end space-x-2">
										<Button variant="outline">Cancel</Button>
										<Button onClick={saveChanges}>Save Changes</Button>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* 3D Model Placeholder */}
					</div>
				)}
			</div>
			<Toaster />
		</div >
	);
};

export default Dashboard;