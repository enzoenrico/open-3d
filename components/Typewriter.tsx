import { motion } from 'framer-motion';

interface TypewriterProps {
	text: string
	styling: string
}

const cursorVariants = {
	blinking: {
		opacity: [0, 0, 1, 1],
		transition: {
			duration: 1,
			repeat: Infinity,
			repeatDelay: 0,
			ease: "linear",
			times: [0, 0.5, 0.5, 1]
		}
	}
}


export default function Typewriter({ text, styling }: TypewriterProps) {
	return (
		<motion.div
			className={styling}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
		>
			{text.split("").map((char, index) => (
				<motion.span
					key={index}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1, type:"tween" }}
					transition={{
						duration: 0.1,
						delay: index * 0.05,
					}}
				>

					{char}
				</motion.span>
			))
			}
			<motion.div variants={cursorVariants} animate="blinking" className="inline-block h-12  w-[10px] translate-y-1 bg-black" />
		</motion.div >
	)
}
