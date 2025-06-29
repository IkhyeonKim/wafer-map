"use client"

import { Die } from "@/lib/Die"
import SingleDie, { DieRenderingInfo } from "./SingleDie"
import Zoomable from "./Zoomable"

export type WaferCanvasProps = {
	dieInfo: Die[]
}

const CANVAS_SIZE = 600
const WAFER_RADIUS = 300
const GAP_WIDTH = 1

export default function WaferCanvas({ dieInfo }: WaferCanvasProps) {

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
				fill="#ffffff"
			/>
			{dieInfo.map((die, index) => {
				const positionX =
					die.x === 0 ? 0 : die.x * singleDieWidth + die.x * GAP_WIDTH
				const positionY =
					die.y === 0 ? 0 : die.y * singleDieWidth + die.y * GAP_WIDTH

				const renderingInfo: DieRenderingInfo = {
					width: singleDieWidth,
					height: singleDieWidth,
					space: GAP_WIDTH,
					positionX,
					positionY,
					waferRadius: WAFER_RADIUS,
					cx: WAFER_RADIUS,
					cy: WAFER_RADIUS,
				}

				return (
					<SingleDie
						key={die.id}
						renderingInfo={renderingInfo}
						dieInfo={{ ...die }}
						dieIndex={index}
					/>
				)
			})}
		</Zoomable>
	)
}
