import { MotionValue, motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const fontSize = 22;
const padding = 15;
const height = fontSize + padding;

export default function Counter({ value }: { value: number }) {
	return (
		<div
			style={{ fontSize }}
			className="flex space-x-3 overflow-hidden rounded bg-white px-2 leading-none text-gray-900"
		>
			<Digit place={100} value={value} />
			<Digit place={10} value={value} />
			<Digit place={1} value={value} />
		</div>
	);
}

function Digit({ place, value }: { place: number; value: number }) {
	let valueRoundedToPlace = Math.floor(value / place);
	let animatedValue = useSpring(valueRoundedToPlace);

	useEffect(() => {
		animatedValue.set(valueRoundedToPlace);
	}, [animatedValue, valueRoundedToPlace]);

	return (
		<div style={{ height }} className="relative w-[1ch] tabular-nums">
			{[...Array(10).keys()].map((i) => (
				<Number key={i} mv={animatedValue} number={i} />
			))}
		</div>
	);
}

function Number({ mv, number }: { mv: MotionValue; number: number }) {
	let y = useTransform(mv, (latest) => {
		let placeValue = latest % 10;
		let offset = (10 + number - placeValue) % 10;

		let memo = offset * height;

		if (offset > 5) {
			memo -= 10 * height;
		}

		return memo;
	});

	return (
		<motion.span
			style={{ y }}
			className="absolute inset-0 flex items-center justify-center"
		>
			{number}
		</motion.span>
	);
}
