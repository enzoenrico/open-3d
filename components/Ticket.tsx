'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { arrayMove } from '@dnd-kit/sortable';

const UserCard = () => {
	const [cards, setCards] = useState([
		{ id: 1, content: 'Card 1 Content' },
		{ id: 2, content: 'Card 2 Content' },
		{ id: 3, content: 'Card 3 Content' },
		{ id: 4, content: 'Card 4 Content' },
	]);

	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const moveCard = (currentIndex: number, direction: 'up' | 'down') => {
		const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
		if (newIndex >= 0 && newIndex < cards.length) {
			setCards(arrayMove(cards, currentIndex, newIndex));
			console.log(cards)
		}
	};

	return (
				<motion.div
					key={card.id}
					className="absolute w-4/5 h-64 bg-slate-100 rounded-xl shadow-lg p-6 cursor-pointer group border hover:border-2 border-blue-200 hover:border-blue-500"
					style={{
						top: index * 40,
						zIndex: activeIndex === index ? 100 : cards.length - index,
					}}
					layout
					animate={{
						y: activeIndex !== null && activeIndex !== index
							? index < activeIndex ? 0 : 20
							: 0,
						scale: activeIndex === index ? 1.05 : 1,
						boxShadow: activeIndex === index
							? '0 20px 25px -5px rgb(0 0 0 / 0.15)'
							: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
					}}
					transition={{ type: 'spring', stiffness: 300, damping: 20 }}
					onHoverStart={() => setActiveIndex(index)}
					onHoverEnd={() => setActiveIndex(null)}
				>
					<div className="flex flex-col h-full">
						<div className="flex justify-between items-start mb-4">
							<h3 className="text-xl font-bold">Card {index + 1}</h3>
							<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
								<button
									onClick={(e) => {
										e.stopPropagation();
										moveCard(index, 'up');
									}}
									className="p-1 hover:bg-gray-100 rounded-full"
									disabled={index === 0}
								>
									<svg
										className="w-6 h-6 text-gray-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 15l7-7 7 7"
										/>
									</svg>
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation();
										moveCard(index, 'down');
									}}
									className="p-1 hover:bg-gray-100 rounded-full"
									disabled={index === cards.length - 1}
								>
									<svg
										className="w-6 h-6 text-gray-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>
							</div>
						</div>
						<p className="text-gray-600">{card.content}</p>
						<motion.div
							className="mt-auto bg-blue-500 text-white px-4 py-2 rounded-lg w-fit"
							animate={{ scale: activeIndex === index ? 1.1 : 1 }}
						>
							Learn More
						</motion.div>
					</div>
				</motion.div>

	);
};

export default UserCard;	