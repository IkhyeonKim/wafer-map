import { useThrottle } from "@/lib/useThrottle"
import {
	ReactNode,
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
} from "react"

export type ZoomableProp = {
	children: ReactNode
	width: number
	height: number
	viewBox?: string
}

type MouseCoordination = Pick<MouseEvent, "clientX" | "clientY">

export default function Zoomable({
	children,
	width,
	height,
	viewBox,
}: ZoomableProp) {
	// TODO
	// 1. panning
	//  - mouse
	// 2. zooming
	const zoomContainerRef = useRef<SVGSVGElement | null>(null)
	const isPanning = useRef<Boolean>(false)
	const [coord, setCoord] = useState<MouseCoordination>({
		clientX: 0,
		clientY: 0,
	})

	const handleMouseMove = useCallback((ev: MouseEvent) => {
		if (!isPanning.current) return
		// console.log("Mouse move", ev.clientX, ev.clientY)
		setCoord({
			clientX: ev.clientX - Math.floor(ev.clientX / 1.3),
			clientY: ev.clientY - Math.floor(ev.clientY / 1.3),
		})
	}, [])
	const mouseMove = useThrottle((ev: MouseEvent) => handleMouseMove(ev), 50)

	useEffect(() => {
		function mouseDown(ev: MouseEvent) {
			isPanning.current = true
			// setCoord({
			// 	clientX: ev.clientX,
			// 	clientY: ev.clientY,
			// })
			console.log("Mouse down", ev)
		}

		function mouseUp(ev: MouseEvent) {
			isPanning.current = false
			console.log("Mouse up", ev)
		}

		console.log("Hiiii")

		if (zoomContainerRef.current) {
			zoomContainerRef.current.addEventListener("mousemove", (ev) =>
				mouseMove(ev)
			)
			zoomContainerRef.current.addEventListener("mousedown", (ev: MouseEvent) =>
				mouseDown(ev)
			)
			zoomContainerRef.current.addEventListener("mouseup", (ev: MouseEvent) =>
				mouseUp(ev)
			)
		}

		return () => {
			if (zoomContainerRef.current) {
				zoomContainerRef.current.removeEventListener("mousemove", (ev) =>
					mouseMove(ev)
				)
				zoomContainerRef.current.removeEventListener("mousedown", mouseDown)
				zoomContainerRef.current.removeEventListener("mouseup", mouseUp)
			}
		}
	}, [mouseMove])

	console.log({ coord })

	return (
		<svg
			ref={zoomContainerRef}
			width={width}
			height={height}
			viewBox={`${coord.clientX} ${coord.clientY} 600 600`}
		>
			{children}
		</svg>
	)
}
