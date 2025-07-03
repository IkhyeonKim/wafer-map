"use client"

import { Die } from "@/lib/Die"
import SingleDie from "./SingleDie"
import Zoomable from "./Zoomable"
import { useAtomValue } from "jotai"
import { selectedDieAtom } from "@/lib/dieAtoms"

export type WaferCanvasProps = {
	dieInfo: Die[]
}

const CANVAS_SIZE = 600
const WAFER_RADIUS = 300
const GAP_WIDTH = 1

export default function WaferCanvas({ dieInfo }: WaferCanvasProps) {
	const selectedDie = useAtomValue(selectedDieAtom)

	if (!dieInfo) return <svg />

	const totalDie = dieInfo.length
	const lastDie = dieInfo[totalDie - 1]
	const { x: mapSize } = lastDie

	const singleDieWidth = (CANVAS_SIZE - mapSize * GAP_WIDTH) / mapSize

	// console.log({ lastDie, singleDieWidth })

	return (
		<Zoomable width={600} height={600} viewBox="0 0 600 600">
			<circle
				cx={WAFER_RADIUS}
				cy={WAFER_RADIUS}
				r={WAFER_RADIUS}
				fill="#ffffff"
			/>
			{dieInfo.map((die, index) => {
				return (
					<SingleDie
						key={die.id}
						itemWidth={singleDieWidth}
						itemHeight={singleDieWidth}
						gap={GAP_WIDTH}
						waferRadius={WAFER_RADIUS}
						dieInfo={die}
						dieIndex={index}
						isSelected={die.id === selectedDie?.id}
					/>
				)
			})}
		</Zoomable>
	)
}
