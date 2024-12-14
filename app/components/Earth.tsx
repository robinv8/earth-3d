"use client";

import { useEffect, useRef } from "react";
import ThreeGlobe from "three-globe";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useRouter } from "next/navigation";

// Major cities coordinates [name, lat, lng]
const CITIES: [string, number, number][] = [
	["New York", 40.7128, -74.006],
	["London", 51.5074, -0.1278],
	["Tokyo", 35.6762, 139.6503],
	["Shanghai", 31.2304, 121.4737],
	["Sydney", -33.8688, 151.2093],
	["Dubai", 25.2048, 55.2708],
	["Paris", 48.8566, 2.3522],
	["Singapore", 1.3521, 103.8198],
	["Beijing", 39.9042, 116.4074],
	["Mumbai", 19.076, 72.8777],
	["San Francisco", 37.7749, -122.4194],
	["Hong Kong", 22.3193, 114.1694],
];

// Array of colors for the arcs
const ARC_COLORS = [
	"#ff4444", // red
	"#44ff44", // green
	"#4444ff", // blue
	"#ffff44", // yellow
	"#ff44ff", // magenta
	"#44ffff", // cyan
	"#ff8844", // orange
	"#44ff88", // turquoise
	"#8844ff", // purple
];

export default function Earth() {
	const containerRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const arcIntervalRef = useRef<NodeJS.Timeout>();

	useEffect(() => {
		if (!containerRef.current) return;

		// Setup renderer
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		containerRef.current.appendChild(renderer.domElement);

		// Setup scene
		const scene = new THREE.Scene();
		scene.background = new THREE.Color("#000000");

		// Setup camera
		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000,
		);
		camera.position.z = 200;

		// Setup controls
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controls.rotateSpeed = 0.5;
		controls.minDistance = 120;
		controls.maxDistance = 300;

		let lastClickTime = 0;
		const doubleClickDelay = 300; // milliseconds
		let isAnimating = false;

		// Add click event listener
		const handleClick = () => {
			const currentTime = new Date().getTime();
			const timeDiff = currentTime - lastClickTime;

			if (timeDiff < doubleClickDelay && !isAnimating) {
				isAnimating = true;

				// 立即清除所有连线动画并停止定时器
				Globe.arcsData([]);
				if (arcIntervalRef.current) {
					clearInterval(arcIntervalRef.current);
					arcIntervalRef.current = undefined;
				}

				// 延迟执行缩放动画，给线条消失留出时间
				setTimeout(() => {
					// Store initial state
					const initialScale = Globe.scale.x;
					const initialPosition = camera.position.z;

					// Animation duration in milliseconds
					const duration = 1000;
					const startTime = Date.now();

					function zoomAnimation() {
						const elapsed = Date.now() - startTime;
						const progress = Math.min(elapsed / duration, 1);

						// Ease out cubic
						const easing = 1 - Math.pow(1 - progress, 3);

						// Scale up the globe
						const scale = initialScale + (2 - initialScale) * easing;
						Globe.scale.set(scale, scale, scale);

						// Zoom in
						camera.position.z = initialPosition - 100 * easing;

						// 渐变大气层颜色到透明
						const atmosphereColor = new THREE.Color("#1da1f2");
						atmosphereColor.multiplyScalar(1 - easing); // 降低颜色强度
						Globe.atmosphereColor(`#${atmosphereColor.getHexString()}`);
						Globe.atmosphereAltitude(0.2 * (1 - easing)); // 同时降低大气层高度

						if (progress < 1) {
							requestAnimationFrame(zoomAnimation);
						} else {
							// Animation complete, navigate to dashboard
							router.push("/dashboard");
						}
					}

					zoomAnimation();
				}, 300); // 等待300毫秒让线条完全消失
			}

			lastClickTime = currentTime;
		};

		renderer.domElement.addEventListener("click", handleClick);

		// Create globe
		const Globe = new ThreeGlobe()
			.globeImageUrl(
				"https://image-static.segmentfault.com/142/585/1425851602-60dd9cfe309dd",
			)
			.bumpImageUrl(
				"https://image-static.segmentfault.com/332/688/3326882554-675dbbedd1cd0",
			)
			.atmosphereColor("#1da1f2")
			.atmosphereAltitude(0.2)
			.arcColor((e: any) => e.color)
			.arcAltitude(0.2)
			.arcStroke(0.5)
			.arcDashLength(0.5)
			.arcDashGap(1)
			.arcDashInitialGap(1)
			.arcDashAnimateTime(3000);

		scene.add(Globe);

		// Add lights
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(1, 1, 1);
		scene.add(directionalLight);

		// Generate random arcs
		function getRandomCity() {
			return CITIES[Math.floor(Math.random() * CITIES.length)];
		}

		function getRandomColor() {
			return ARC_COLORS[Math.floor(Math.random() * ARC_COLORS.length)];
		}

		function createNewArc() {
			const startCity = getRandomCity();
			let endCity = getRandomCity();
			while (endCity === startCity) {
				endCity = getRandomCity();
			}

			return {
				startLat: startCity[1],
				startLng: startCity[2],
				endLat: endCity[1],
				endLng: endCity[2],
				color: getRandomColor(),
			};
		}

		// Initialize arcs
		const arcsData = Array(20).fill(0).map(createNewArc);
		Globe.arcsData(arcsData);

		// Periodically update arcs
		arcIntervalRef.current = setInterval(() => {
			const newArcsData = arcsData.map((arc) => {
				if (Math.random() > 0.7) {
					// 30% chance to replace arc
					return createNewArc();
				}
				return arc;
			});
			Globe.arcsData(newArcsData);
		}, 2000);

		// Animation loop
		function animate() {
			requestAnimationFrame(animate);

			// Rotate the globe
			// @ts-ignore (three-globe types are not complete)
			Globe.rotation.y += 0.001;

			controls.update();
			renderer.render(scene, camera);
		}
		animate();

		// Handle window resize
		function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		}
		window.addEventListener("resize", onWindowResize);

		// Cleanup
		return () => {
			window.removeEventListener("resize", onWindowResize);
			if (arcIntervalRef.current) {
				clearInterval(arcIntervalRef.current);
			}
			renderer.dispose();
		};
	}, []);

	return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
}
