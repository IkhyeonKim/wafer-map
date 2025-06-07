"use client"

import { Die } from "@/lib/Die"
import { useEffect, useRef } from "react"
import SingleDie from "./SingleDie"
import { useDieStore } from "@/stores/die-store-provider"
import Zoomable from "./Zoomable"

export type WaferCanvasProps = {
	dieInfo: Die[]
}

const CANVAS_SIZE = 600
const WAFER_RADIUS = 300
const GAP_WIDTH = 1

export default function WaferCanvas({ dieInfo }: WaferCanvasProps) {
	const svgElement = useRef<SVGSVGElement>(null)
	const { initDie, dies } = useDieStore((state) => state)

	useEffect(() => {
		initDie(dieInfo)
	}, [dieInfo])

	if (!dieInfo) return <svg />

	const totalDie = dieInfo.length
	const lastDie = dieInfo[totalDie - 1]
	const { x: mapSize } = lastDie

	// const singleDieWidth = 3
	const singleDieWidth = (CANVAS_SIZE - mapSize * GAP_WIDTH) / mapSize

	console.log({ lastDie, singleDieWidth })

	return (
		<Zoomable width={600} height={600} viewBox="0 0 600 600">
			<circle
				cx={WAFER_RADIUS}
				cy={WAFER_RADIUS}
				r={WAFER_RADIUS}
				fill="#f1f1f1"
			/>
			{/* {dies.map((die) => {
				const positionX =
					die.x === 0 ? 0 : die.x * singleDieWidth + die.x * GAP_WIDTH
				const positionY =
					die.y === 0 ? 0 : die.y * singleDieWidth + die.y * GAP_WIDTH
				return (
					<SingleDie
						width={singleDieWidth}
						height={singleDieWidth}
						space={GAP_WIDTH}
						key={die.id}
						positionX={positionX}
						positionY={positionY}
						waferRadius={WAFER_RADIUS}
						cx={WAFER_RADIUS}
						cy={WAFER_RADIUS}
						{...die}
					/>
				)
			})} */}
		</Zoomable>
	)
}
