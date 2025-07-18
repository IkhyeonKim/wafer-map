"use client"

import { Die } from "@/lib/Die"
import SingleDie from "./SingleDie/SingleDie"
import Zoomable, { ZoomableHandle } from "./Zoomable"
import { useAtomValue } from "jotai"
import { selectedDieAtom } from "@/lib/dieAtoms"
import { Button } from "./ui/button"
import { useRef } from "react"

export type WaferCanvasProps = {
	dieInfo: Die[]
	mapSize: number
}

const CANVAS_SIZE = 600
const WAFER_RADIUS = 300
const GAP_WIDTH = 1

export default function WaferCanvas({ dieInfo, mapSize }: WaferCanvasProps) {
	const selectedDie = useAtomValue(selectedDieAtom)
	const zoomableRef = useRef<ZoomableHandle>(null)

	if (!dieInfo) return <svg />

	const singleDieWidth = (CANVAS_SIZE - mapSize * GAP_WIDTH) / mapSize

	console.log({ singleDieWidth })

	const onResetZoom = () => {
		zoomableRef.current?.setScale({
			translateX: 0,
			translateY: 0,
			scale: 1,
		})
	}

	return (
		<div className="relative">
			<Zoomable
				width={600}
				height={600}
				viewBox="0 0 600 600"
				ref={zoomableRef}
			>
				<circle
					cx={WAFER_RADIUS}
					cy={WAFER_RADIUS}
					r={WAFER_RADIUS}
					fill="#e3e3e3"
				/>
				{dieInfo.map((die) => {
					return (
						<SingleDie
							key={die.id}
							itemWidth={singleDieWidth}
							itemHeight={singleDieWidth}
							gap={GAP_WIDTH}
							waferRadius={WAFER_RADIUS}
							dieInfo={die}
							isSelected={die.id === selectedDie?.id}
						/>
					)
				})}
			</Zoomable>
			<div className="absolute bottom-2 right-2">
				<Button className="cursor-pointer" onClick={onResetZoom}>
					Reset
				</Button>
			</div>
		</div>
	)
}
