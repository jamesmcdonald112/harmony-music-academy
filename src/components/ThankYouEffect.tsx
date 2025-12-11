import confetti from "canvas-confetti";
import { useEffect, useRef } from "react";
import { Toaster, toast } from "sonner";

export default function () {
	const hasRun = useRef(false);

	useEffect(() => {
		if (hasRun.current) return;
		hasRun.current = true;

		// 1. Trigger toast
		toast.success("Email sent successfully!", { duration: 4000 });

		// 2. Trigger confetti
		confetti({
			particleCount: 100,
			spread: 70,
			startVelocity: 50,
			ticks: 90,
			origin: { x: 0.5, y: 1 },
			gravity: 1.2,
			disableForReducedMotion: true,
		});
	}, []);

	return (
		<Toaster
			richColors
			position="top-right"
			toastOptions={{ duration: 4000 }}
		/>
	);
}
