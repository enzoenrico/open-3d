"use client"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Details() {
    const handleSumbmission = () => { return }
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <form onSubmit={handleSumbmission} className="w-1/2 flex items-center justify-center">
            <Select>
                <SelectTrigger className="w-3/5">
                    <SelectValue placeholder="Material" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="PLA">PLA</SelectItem>
                    <SelectItem value="ABS">ABS</SelectItem>
                </SelectContent>
            </Select>
            </form>
        </div>
    )
}
