import { useThrottle } from "@/lib/useThrottle"
import { ReactNode, useCallback, useEffect, useRef, useState } from "react"

export type ZoomableProp = {
	children: ReactNode
	width: number
	height: number
	viewBox?: string
}

type MouseCoordination = Pick<MouseEvent, "clientX" | "clientY">
type Transform = {
	translateX: number
	translateY: number
	scale: number
}

const INITIAL_SCALE = 600

export default function Zoomable({
	children,
	width,
	height,
	viewBox,
}: ZoomableProp) {
	const zoomContainerRef = useRef<SVGSVGElement | null>(null)
	const isPanningRef = useRef<Boolean>(false)
    const [isPanning, setIsPanning] = useState<Boolean>(false)
	const panStart = useRef<MouseCoordination>({
		clientX: 0,
		clientY: 0,
	})

	const [transform, setTransform] = useState<Transform>({
		translateX: 0,
		translateY: 0,
		scale: 1,
	})
	const transformStartRef = useRef<Transform>({
		translateX: 0,
		translateY: 0,
		scale: 1,
	})

	const handleMouseMove = useCallback((ev: MouseEvent) => {
		if (!isPanningRef.current) return

		const dx = ev.clientX - panStart.current.clientX
		const dy = ev.clientY - panStart.current.clientY

		setTransform((prev) => ({
			...prev,
			translateX: transformStartRef.current.translateX + dx,
			translateY: transformStartRef.current.translateY + dy,
		}))
	}, [])
	const mouseMove = useThrottle((ev: MouseEvent) => handleMouseMove(ev), 5)

	const handleWheel = useCallback((ev: WheelEvent) => {
		const zoomRect = zoomContainerRef.current?.getBoundingClientRect()

		if (zoomRect) {
			setTransform((prevTransform) => {
				const zoomSpeed = 0.01
				const delta = ev.deltaY * zoomSpeed

				const newScale = Math.min(Math.max(0.8, prevTransform.scale - delta), 4)
				const mouseX = ev.clientX - zoomRect.left
				const mouseY = ev.clientY - zoomRect.top

				const newTranslateX =
					mouseX -
					(mouseX - prevTransform.translateX) * (newScale / prevTransform.scale)
				const newTranslateY =
					mouseY -
					(mouseY - prevTransform.translateY) * (newScale / prevTransform.scale)

				return {
					translateX: newTranslateX,
					translateY: newTranslateY,
					scale: newScale,
				}
			})
		}
	}, [])
	const wheel = useThrottle((ev: WheelEvent) => handleWheel(ev), 10)

	const handleMouseDown = (ev: MouseEvent) => {
        setIsPanning(true)
		isPanningRef.current = true
		panStart.current = {
			clientX: ev.clientX,
			clientY: ev.clientY,
		}
		transformStartRef.current = {
			translateX: transform.translateX,
			translateY: transform.translateY,
			scale: transform.scale,
		}
	}

	useEffect(() => {
		function mouseLeave() {
			isPanningRef.current = false
            setIsPanning(false)
		}
		function mouseUp(ev: MouseEvent) {
			isPanningRef.current = false
            setIsPanning(false)
		}

		if (zoomContainerRef.current) {
			zoomContainerRef.current.addEventListener("mousemove", (ev) =>
				mouseMove(ev)
			)
			zoomContainerRef.current.addEventListener("mousedown", (ev: MouseEvent) =>
				handleMouseDown(ev)
			)
			zoomContainerRef.current.addEventListener("mouseup", (ev: MouseEvent) =>
				mouseUp(ev)
			)
			zoomContainerRef.current.addEventListener("mouseleave", () =>
				mouseLeave()
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
				zoomContainerRef.current.removeEventListener(
					"mousedown",
					handleMouseDown
				)
				zoomContainerRef.current.removeEventListener("mouseup", mouseUp)
				zoomContainerRef.current.removeEventListener("mouseleave", mouseLeave)
				zoomContainerRef.current.removeEventListener("wheel", wheel)
			}
		}
	}, [mouseMove, wheel, handleMouseDown])

	return (
		<svg
			ref={zoomContainerRef}
			width={width}
			height={height}
			viewBox={`0 0 ${INITIAL_SCALE} ${INITIAL_SCALE}`}
			className={isPanning ? "cursor-grabbing" : "cursor-grab"}
		>
			<g
				// transform: matrix(scaleX, skewY, skewX, scaleY, translateX, translateY);
				transform={`matrix(${transform.scale} 0 0 ${transform.scale} ${transform.translateX} ${transform.translateY})`}
			>
				{children}
			</g>
			<rect width={width} height={height} className={"fill-transparent"} />
		</svg>
	)
}
