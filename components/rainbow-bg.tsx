"use client"
import { useTransform } from "framer-motion";
import { useTime } from "framer-motion";

export function useRainbowBackground() {
	const time = useTime()
	const rotate_bg = useTransform(time, [0, 3000], [0, 360], {
		clamp: false
	})

	const rotating_bg = useTransform(rotate_bg, (r) => {
		return `conic-gradient(from ${r}deg, #ff4545, #00ff99, #006aff, #ff0095, #ff4545)`
	})
	return rotating_bg
}