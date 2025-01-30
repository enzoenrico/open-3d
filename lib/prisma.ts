import { PrismaClient } from "@prisma/client"
declare global {
	const prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient()

export default prisma