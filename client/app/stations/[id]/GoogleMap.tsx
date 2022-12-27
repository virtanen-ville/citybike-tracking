import {
	useEffect,
	useRef,
	useState,
	Children,
	isValidElement,
	cloneElement,
} from "react";
export default function GoogleMap({
	center,
	zoom,
	children,
	style,
}: {
	center: google.maps.LatLngLiteral;
	zoom: number;
	children: React.ReactNode;
	style?: React.CSSProperties;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [map, setMap] = useState<google.maps.Map>();

	useEffect(() => {
		if (ref.current && !map) {
			setMap(new window.google.maps.Map(ref.current, { center, zoom }));
		}
	}, [ref, map, center, zoom]);

	return (
		<>
			<div ref={ref} style={style} />
			{Children.map(children, (child) => {
				if (isValidElement(child)) {
					// @ts-ignore
					return cloneElement(child, { map });
				}
			})}
		</>
	);
}
