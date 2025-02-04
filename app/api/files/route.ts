import supabase from "@/lib/supabase"
import { NextResponse } from "next/server"

export const GET = async () => {
	// need authentication to access private storage
	const data = await supabase.storage.listBuckets()
	console.log(data)
	return NextResponse.json(
		{ message: data.data },
		{ status: 200 }
	)
}

export const POST = async (req: Request) => {
	// const { file } = await req.json()

	return NextResponse.json(
		{ message: "no" },
		{ status: 400 }
	)
}