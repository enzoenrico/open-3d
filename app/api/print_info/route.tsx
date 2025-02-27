import prisma from "@/lib/prisma";
import { PrintInfo } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const info_obj: PrintInfo = await req.json()
	console.log("INFO OBJ")
	console.log(info_obj)
	try {
		const new_info_entry = await prisma.printInfo.create({
			data: info_obj
		})
		return NextResponse.json(
			{ message: new_info_entry.id },
			{ status: 200 }
		)
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ message: "Error creating printing details on database" },
			{ status: 500 }
		)
	}
}