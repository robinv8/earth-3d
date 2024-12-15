import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Globe from "globe.gl";
import { csvParseRows } from "d3-dsv";
import indexBy from "index-array-by";

interface Route {
	airline: string;
	airlineId: string;
	srcIata: string;
	srcAirportId: string;
	dstIata: string;
	dstAirportId: string;
	codeshare: string;
	stops: string;
	equipment: string;
}

interface Airport {
	airportId: string;
	name: string;
	city: string;
	country: string;
	iata: string;
	icao: string;
	lat: string;
	lng: string;
	alt: string;
	timezone: string;
	dst: string;
	tz: string;
	type: string;
	source: string;
}

export default function Earth() {
	const router = useRouter();
	const globeVizRef = useRef<HTMLDivElement>(null);
	const transitionRef = useRef<boolean>(false);

	const handleTransition = () => {
		if (transitionRef.current || !globeVizRef.current) return;
		transitionRef.current = true;

		const globeEl = globeVizRef.current;
		globeEl.style.transition = 'transform 1s ease-in, opacity 1s ease-in';
		globeEl.style.transform = 'scale(2)';
		globeEl.style.opacity = '0';

		setTimeout(() => {
			router.push("/dashboard");
		}, 1000);
	};

	useEffect(() => {
		if (!globeVizRef.current) return;
		const COUNTRY = "China";
		const OPACITY = 0.22;

		const myGlobe = new Globe(globeVizRef.current)

			.globeImageUrl("https://image-static.segmentfault.com/142/585/1425851602-60dd9cfe309dd")
			.pointOfView({ lat: 35, lng: 105, altitude: 2 }) // aim at China centroid

			.onGlobeClick(handleTransition)
			.onArcClick(handleTransition)

			.arcLabel((d) => `${d.airline}: ${d.srcIata} &#8594; ${d.dstIata}`)
			.arcStartLat((d) => +d.srcAirport.lat)
			.arcStartLng((d) => +d.srcAirport.lng)
			.arcEndLat((d) => +d.dstAirport.lat)
			.arcEndLng((d) => +d.dstAirport.lng)
			.arcDashLength(0.1)
			.arcDashGap(1)
			.arcDashInitialGap(() => Math.random())
			.arcDashAnimateTime(4000)
			.arcColor([
				`rgba(0, 255, 0, ${OPACITY})`,
				`rgba(255, 0, 0, ${OPACITY})`,
			])
			.arcStroke(0.3)
			.arcsTransitionDuration(0)

			.pointColor(() => "orange")
			.pointAltitude(0)
			.pointRadius(0.02)
			.pointsMerge(true);

		// load data

		const airportParse = ([
			airportId,
			name,
			city,
			country,
			iata,
			icao,
			lat,
			lng,
			alt,
			timezone,
			dst,
			tz,
			type,
			source,
		]: string[]): Airport => ({
			airportId,
			name,
			city,
			country,
			iata,
			icao,
			lat,
			lng,
			alt,
			timezone,
			dst,
			tz,
			type,
			source,
		});
		const routeParse = ([
			airline,
			airlineId,
			srcIata,
			srcAirportId,
			dstIata,
			dstAirportId,
			codeshare,
			stops,
			equipment,
		]: string[]): Route => ({
			airline,
			airlineId,
			srcIata,
			srcAirportId,
			dstIata,
			dstAirportId,
			codeshare,
			stops,
			equipment,
		});

		Promise.all([
			fetch(
				"https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat",
			)
				.then((res) => res.text())
				.then((d) => csvParseRows(d, airportParse)),
			fetch(
				"https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat",
			)
				.then((res) => res.text())
				.then((d) => csvParseRows(d, routeParse)),
		]).then(([airports, routes]) => {
			const byIata = indexBy(airports, "iata", false);

			const filteredRoutes = routes
				.filter(
					(d) =>
						byIata.hasOwnProperty(d.srcIata) &&
						byIata.hasOwnProperty(d.dstIata),
				) // exclude unknown airports
				.filter((d) => d.stops === "0") // non-stop flights only
				.map((d) =>
					Object.assign(d, {
						srcAirport: byIata[d.srcIata],
						dstAirport: byIata[d.dstIata],
					}),
				)
				.filter(
					(d) =>
						d.srcAirport.country === COUNTRY &&
						d.dstAirport.country !== COUNTRY,
				); // international routes from country

			myGlobe.pointsData(airports).arcsData(filteredRoutes);
		});


	}, [router, globeVizRef]);

	return (
		<div
			id="globeViz"
			ref={globeVizRef}
			style={{
				width: "100%",
				height: "100vh",
				transition: "transform 1s ease-in, opacity 1s ease-in"
			}}
		/>
	);
}
