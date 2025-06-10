import { useThrottle } from "@/lib/useThrottle"
import { ReactNode, useCallback, useEffect, useRef, useState } from "react"

export type ZoomableProp = {
	children: ReactNode
	width: number
	height: number
	viewBox?: string
}

type MouseCoordination = Pick<MouseEvent, "clientX" | "clientY">
type Coord = {
	x: number
	y: number
}

const INITIAL_SCALE = 600
const MAX_SCALE = 600

export default function Zoomable({
	children,
	width,
	height,
	viewBox,
}: ZoomableProp) {
	const zoomContainerRef = useRef<SVGSVGElement | null>(null)
	const isPanning = useRef<Boolean>(false)
	const currentScale = useRef(INITIAL_SCALE)
	const [coord, setCoord] = useState<MouseCoordination>({
		clientX: 0,
		clientY: 0,
	})
	const panStart = useRef<MouseCoordination>({
		clientX: 0,
		clientY: 0,
	})
	const [scale, setScale] = useState<number>(INITIAL_SCALE)

	const handleMouseMove = useCallback((ev: MouseEvent) => {
		if (!isPanning.current) return

		const dx =
			ev.clientX - panStart.current.clientX * (currentScale.current / MAX_SCALE)
		const dy =
			ev.clientY - panStart.current.clientY * (currentScale.current / MAX_SCALE)

		setCoord({
			clientX: dx,
			clientY: dy,
		})
	}, [])
	const mouseMove = useThrottle((ev: MouseEvent) => handleMouseMove(ev), 5)

	const handleWheel = useCallback((ev: WheelEvent) => {
		// Get this code from mdn
		// scale += event.deltaY * -0.01;
		setScale((preScale) => {
			const newScale = preScale + ev.deltaY * -1

			// min scale is 100 and max is 600
			const restrictScale = Math.min(Math.max(100, newScale), MAX_SCALE)
			currentScale.current = restrictScale
			return restrictScale
		})
	}, [])
	const wheel = useThrottle((ev: WheelEvent) => handleWheel(ev), 10)

	const mouseDown = useCallback((ev: MouseEvent) => {
		isPanning.current = true
		panStart.current = {
			clientX: ev.clientX,
			clientY: ev.clientY,
		}
	}, [])

	useEffect(() => {
		function mouseLeave() {
			isPanning.current = false
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
			// zoomContainerRef.current.addEventListener("mouseleave", () =>
			// 	mouseLeave()
			// )
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
				zoomContainerRef.current.removeEventListener("mouseleave", mouseLeave)
				zoomContainerRef.current.removeEventListener("wheel", wheel)
			}
		}
	}, [mouseDown, mouseMove, wheel])

	return (
		<svg
			ref={zoomContainerRef}
			width={width}
			height={height}
			viewBox={`${coord.clientX} ${coord.clientY} ${scale} ${scale}`}
            className={isPanning.current ? "cursor-grabbing" : "cursor-grab"}
		>
			{children}
		</svg>
	)
}
