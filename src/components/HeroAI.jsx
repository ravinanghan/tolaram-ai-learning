import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import Button from './Button';
import { Mail, Code2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Constellation animation component
const ConstellationBackground = () => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		const resizeCanvas = () => {
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
		};

		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);

		// Constellation nodes representing AI concepts
		const nodes = [
			{ x: 0.15, y: 0.25, label: 'Data', connected: [1, 2] },
			{ x: 0.25, y: 0.7, label: 'Algorithms', connected: [0, 2, 5] },
			{ x: 0.5, y: 0.45, label: 'Strategy', connected: [0, 1, 3, 4] },
			{ x: 0.75, y: 0.3, label: 'Ethics', connected: [2, 4] },
			{ x: 0.85, y: 0.65, label: 'Innovation', connected: [2, 3, 5] },
			{ x: 0.4, y: 0.8, label: 'Compute', connected: [1, 4] }
		];

		let animationFrame;
		let time = 0;

		const animate = () => {
			time += 0.01;
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Draw connections
			nodes.forEach((node, i) => {
				node.connected.forEach(connectedIndex => {
					if (connectedIndex > i) { // Avoid duplicate lines
						const connectedNode = nodes[connectedIndex];
						const opacity = 0.2 + 0.1 * Math.sin(time + i * 0.5);

						ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.moveTo(node.x * canvas.width, node.y * canvas.height);
						ctx.lineTo(connectedNode.x * canvas.width, connectedNode.y * canvas.height);
						ctx.stroke();
					}
				});
			});

			// Draw nodes
			nodes.forEach((node, i) => {
				const pulse = 1 + 0.2 * Math.sin(time * 2 + i);
				const x = node.x * canvas.width;
				const y = node.y * canvas.height;

				// Outer glow
				const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15 * pulse);
				gradient.addColorStop(0, 'rgba(99, 102, 241, 0.8)');
				gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
				ctx.fillStyle = gradient;
				ctx.beginPath();
				ctx.arc(x, y, 15 * pulse, 0, Math.PI * 2);
				ctx.fill();

				// Core node
				ctx.fillStyle = '#6366f1';
				ctx.beginPath();
				ctx.arc(x, y, 4 * pulse, 0, Math.PI * 2);
				ctx.fill();
			});

			animationFrame = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener('resize', resizeCanvas);
			if (animationFrame) {
				cancelAnimationFrame(animationFrame);
			}
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="absolute inset-0 w-full h-full pointer-events-none"
			style={{ opacity: 0.6 }}
		/>
	);
};

const HeroAI = () => {
	const navigate = useNavigate();

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			className="mb-8"
		>
			<Card
				variant="primary"
				className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900/30 border-0 shadow-2xl dark:shadow-indigo-500/10"
			>
				{/* Constellation Background */}
				<ConstellationBackground />

				{/* Enhanced gradient orbs */}
				<div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-600/20 blur-3xl pointer-events-none animate-pulse" />
				<div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-gradient-to-tr from-blue-400/20 to-cyan-600/20 blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-gradient-to-r from-violet-400/10 to-fuchsia-400/10 blur-2xl pointer-events-none" />

				<div className="relative z-10 p-8 sm:p-12">
					{/* Main heading */}
					<motion.div
						className="mb-8"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
					>
						<h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-red-500 via-blue-600 to-red-600 bg-clip-text text-transparent leading-relaxed pb-3">
							Leading in the Age of AI
						</h1>
					</motion.div>

					{/* Description */}
					<motion.div
						className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl mb-8"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
					>
						<p className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-200">
							Artificial Intelligence is not a technology of the future.
							<br /> it is the <span className="font-bold text-indigo-600 dark:text-indigo-400">operational reality of today</span>.
						</p>
						<p className="text-base sm:text-lg">
							This program is for leaders who understand that mastering AI is a strategic imperative. It is about developing the <span className="font-semibold text-slate-900 dark:text-white">acumen to see opportunities</span>, the <span className="font-semibold text-slate-900 dark:text-white">language to guide teams</span>, and the <span className="font-semibold text-slate-900 dark:text-white">wisdom to deploy this power responsibly</span>.
						</p>
					</motion.div>

					{/* Action buttons */}
					<motion.div
						className="flex flex-col sm:flex-row gap-4"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.6 }}
					>
						<Button
							variant="gradient"
							icon={<Code2 className="w-5 h-5" />}
							className="w-full sm:w-auto px-8 py-4 text-lg font-semibold"
							onClick={() => navigate("/ai-timeline")}
						>
							Explore AI Timeline
						</Button>

						<Button
							variant="outline"
							icon={<Mail className="w-5 h-5" />}
							as="a"
							href="mailto:ai@tolaram.com"
							className="w-full sm:w-auto px-8 py-4 text-lg font-semibold hover:dark:text-white"
						>
							Contact AI Team
						</Button>
					</motion.div>
				</div>
			</Card>
		</motion.div>
	);
};

export default HeroAI;


