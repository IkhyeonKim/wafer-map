"use client"

import { Die } from "@/lib/Die"
import { useEffect, useRef } from "react"
import SingleDie from "./SingleDie"

export type WaferCanvasProps = {
	dieInfo: Die[]
}

export default function WaferCanvas({ dieInfo }: WaferCanvasProps) {
	const svgElement = useRef<SVGSVGElement>(null)

	if (!dieInfo) return <svg />

	return (
		<svg ref={svgElement} width="500" height="350">
			{dieInfo.map((die) => {
				return <SingleDie key={die.id} {...die} />
			})}
		</svg>
	)
}
