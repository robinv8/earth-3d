"use client";
import dynamic from "next/dynamic";

const Earth = dynamic(() => import("./components/Earth"), { ssr: false });

export default function Home() {
	return (
		<main className="w-full h-screen">
			<Earth />
		</main>
	);
}
