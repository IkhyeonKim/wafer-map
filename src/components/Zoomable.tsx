import { useThrottle } from "@/lib/useThrottle"
import { ReactNode, useEffect, useId, useRef, useState } from "react"

export type ZoomableProp = {
	children: ReactNode
	width: number
	height: number
	viewBox?: string
}

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
	const [isPanning, setIsPanning] = useState(false)

	useEffect(() => {
		const mouseMove = useThrottle((ev: MouseEvent) => {
			console.log("Mouse move", ev)
		}, 300)

		function mouseDown(ev: MouseEvent) {
			setIsPanning(true)
			console.log("Mouse down", ev)
		}

		function mouseUp(ev: MouseEvent) {
			setIsPanning(false)
			console.log("Mouse up", ev)
		}

		if (zoomContainerRef.current) {
			zoomContainerRef.current.addEventListener("mousemove", (ev) => mouseMove((ev) => {}))
			zoomContainerRef.current.addEventListener("mousedown", (ev: MouseEvent) =>
				mouseDown(ev)
			)
			zoomContainerRef.current.addEventListener("mouseup", (ev: MouseEvent) =>
				mouseUp(ev)
			)
		}

		return () => {
			if (zoomContainerRef.current) {
				zoomContainerRef.current.removeEventListener("mousemove", (ev) => mouseMove((ev) => {}))
				zoomContainerRef.current.removeEventListener("mousedown", mouseDown)
				zoomContainerRef.current.removeEventListener("mouseup", mouseUp)
			}
		}
	}, [])

	useEffect(() => {}, [])

	return (
		<svg
			ref={zoomContainerRef}
			width={width}
			height={height}
			viewBox={viewBox ? viewBox : "0 0 600 600"}
		>
			{children}
		</svg>
	)
}
