import { useThrottle } from "@/lib/useThrottle"
import { ReactNode, useCallback, useEffect, useRef, useState } from "react"

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
	const zoomContainerRef = useRef<SVGSVGElement | null>(null)
	const isPanning = useRef<Boolean>(false)
	const [coord, setCoord] = useState<MouseCoordination>({
		clientX: 0,
		clientY: 0,
	})
	const [scale, setScale] = useState<number>(600)

	const handleMouseMove = useCallback((ev: MouseEvent) => {
		if (!isPanning.current) return

		setCoord({
			clientX: ev.clientX - Math.floor(ev.clientX / 2),
			clientY: ev.clientY - Math.floor(ev.clientY / 2),
		})
	}, [])
	const mouseMove = useThrottle((ev: MouseEvent) => handleMouseMove(ev), 5)

	const handleWheel = useCallback((ev: WheelEvent) => {
		// Get this code from mdn
		// scale += event.deltaY * -0.01;
		setScale((preScale) => {
			const newScale = preScale + ev.deltaY * -1

			// min scale is 100 and max is 600
			const restrictScale = Math.min(Math.max(100, newScale), 600)
			return restrictScale
		})
	}, [])
	const wheel = useThrottle((ev: WheelEvent) => handleWheel(ev), 10)

	useEffect(() => {
		function mouseDown(ev: MouseEvent) {
			isPanning.current = true
		}

		function mouseUp(ev: MouseEvent) {
			isPanning.current = false
		}

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
			zoomContainerRef.current.addEventListener("wheel", (ev: WheelEvent) =>
				wheel(ev)
			)
		}

		return () => {
			if (zoomContainerRef.current) {
				zoomContainerRef.current.removeEventListener("mousemove", (ev) =>
					mouseMove(ev)
				)
				zoomContainerRef.current.removeEventListener("mousedown", mouseDown)
				zoomContainerRef.current.removeEventListener("mouseup", mouseUp)
				zoomContainerRef.current.removeEventListener("wheel", wheel)
			}
		}
	}, [mouseMove, wheel])

	return (
		<svg
			ref={zoomContainerRef}
			width={width}
			height={height}
			viewBox={`${coord.clientX} ${coord.clientY} ${scale} ${scale}`}
		>
			{children}
		</svg>
	)
}
