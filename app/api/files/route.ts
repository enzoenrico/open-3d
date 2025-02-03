import { NextResponse } from "next/server"

export const GET = () => {
	
	return NextResponse.json(
		{ message: "ok" },
		{ status: 400 }
	)
}

export const POST = async (req: Request) => {
	const { file } await req.json()
	
}