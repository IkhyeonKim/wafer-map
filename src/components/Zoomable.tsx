import { useThrottle } from "@/lib/useThrottle"
import { atom, useSetAtom } from "jotai"
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

export const stableIsDraggedAtom = atom(false)

export default function Zoomable({
	children,
	width,
	height,
}: // viewBox,
ZoomableProp) {
	const setStableIsDragged = useSetAtom(stableIsDraggedAtom)
	const zoomContainerRef = useRef<SVGSVGElement | null>(null)
	const [isPanning, setIsPanning] = useState<boolean>(false)
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

	const handleMouseMove = useCallback(
		(ev: MouseEvent) => {
			if (!isPanning) return

			const dx = ev.clientX - panStart.current.clientX
			const dy = ev.clientY - panStart.current.clientY

			if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
				setStableIsDragged(true)
			}

			setTransform((prev) => ({
				...prev,
				translateX: transformStartRef.current.translateX + dx,
				translateY: transformStartRef.current.translateY + dy,
			}))
		},
		[isPanning, setStableIsDragged]
	)
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

	const handleMouseDown = useCallback(
		(ev: MouseEvent) => {
			setIsPanning(true)
			// NOTE: init isDragged flag
			setStableIsDragged(false)
			panStart.current = {
				clientX: ev.clientX,
				clientY: ev.clientY,
			}
			transformStartRef.current = {
				translateX: transform.translateX,
				translateY: transform.translateY,
				scale: transform.scale,
			}
		},
		[transform, setStableIsDragged]
	)

	const handleMouseUp = useCallback(() => {
		setIsPanning(false)
	}, [])

	const handleMouseLeave = useCallback(() => {
		setIsPanning(false)
	}, [])

	useEffect(() => {
		const svgElement = zoomContainerRef.current

		if (svgElement) {
			svgElement.addEventListener("mousemove", mouseMove)
			svgElement.addEventListener("mousedown", handleMouseDown)
			svgElement.addEventListener("mouseup", handleMouseUp)
			svgElement.addEventListener("mouseleave", handleMouseLeave)
			svgElement.addEventListener("wheel", wheel)
		}

		return () => {
			if (svgElement) {
				svgElement.removeEventListener("mousemove", mouseMove)
				svgElement.removeEventListener(
					"mousedown",
					handleMouseDown
				)
				svgElement.removeEventListener("mouseup", handleMouseUp)
				svgElement.removeEventListener(
					"mouseleave",
					handleMouseLeave
				)
				svgElement.removeEventListener("wheel", wheel)
			}
		}
	}, [mouseMove, wheel, handleMouseDown, handleMouseUp, handleMouseLeave])

	return (
		<svg
			ref={zoomContainerRef}
			width={width}
			height={height}
			viewBox={`0 0 ${INITIAL_SCALE} ${INITIAL_SCALE}`}
			className={
				isPanning
					? "cursor-grabbing rounded-xl border border-slate-50"
					: "cursor-grab rounded-xl border border-slate-50"
			}
		>
			<g
				transform={`matrix(${transform.scale} 0 0 ${transform.scale} ${transform.translateX} ${transform.translateY})`}
			>
				{children}
			</g>
			{/* <rect width={width} height={height} className={"fill-transparent"} /> */}
		</svg>
	)
}
