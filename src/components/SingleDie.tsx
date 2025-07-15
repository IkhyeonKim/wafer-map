import { Die } from "@/lib/Die"
import { memo, useMemo } from "react"
import { useSetAtom } from "jotai"
import { selectDieAtom } from "@/lib/dieAtoms"
import { useDieSeverity } from "@/lib/useDieSeverity"

export type DieRenderingInfo = {
	width: number
	height: number
	space: number
	positionX: number
	positionY: number
	waferRadius: number
	cx: number
	cy: number
}

export type SingleDieProps = {
	dieInfo: Die
	waferRadius: number
	dieIndex: number
	isSelected: boolean
	itemWidth: number
	itemHeight: number
	gap: number
}

export default memo(function SingleDie(props: SingleDieProps) {
	const { dieInfo, isSelected, itemWidth, itemHeight, gap } = props

	const { id, x, y, isDefective } = dieInfo

	const { positionX, positionY } = useMemo(
		() => ({
			positionX: x === 0 ? 0 : x * itemWidth + x * gap,
			positionY: y === 0 ? 0 : y * itemHeight + y * gap,
		}),
		[x, y, itemWidth, itemHeight, gap]
	)

	const selectThisDie = useSetAtom(selectDieAtom)

	const severityColor = useDieSeverity(dieInfo)
	const shouldPing = dieInfo.defectInfo?.severity === "High"

	return (
		<>
			{
				<g>
					{shouldPing && (
						<rect
							className={"ping-rect"}
							id={id}
							x={positionX}
							y={positionY}
							width={itemWidth}
							height={itemHeight}
							fill={
								isSelected ? "#341ade" : isDefective ? severityColor : "#7b818a"
							}
							onClick={() => selectThisDie(dieInfo)}
						/>
					)}

					<rect
						id={id}
						x={positionX}
						y={positionY}
						width={itemWidth}
						height={itemHeight}
						fill={
							isSelected ? "#341ade" : isDefective ? severityColor : "#7b818a"
						}
						onClick={() => selectThisDie(dieInfo)}
					/>
				</g>
			}
		</>
	)
})
