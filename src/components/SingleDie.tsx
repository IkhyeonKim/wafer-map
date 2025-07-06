import { Die } from "@/lib/Die"
import { memo, useMemo } from "react"
import { useSetAtom } from "jotai"
import { selectDieAtom } from "@/lib/dieAtoms"

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

function calcHypotenuse(a: number, b: number) {
	return Math.sqrt(a * a + b * b)
}

export default memo(function SingleDie(props: SingleDieProps) {
	const { dieInfo, isSelected, itemWidth, itemHeight, gap, waferRadius } = props

	const { id, x, y, isDefective } = dieInfo

	const { positionX, positionY } = useMemo(
		() => ({
			positionX: x === 0 ? 0 : x * itemWidth + x * gap,
			positionY: y === 0 ? 0 : y * itemHeight + y * gap,
		}),
		[x, y, itemWidth, itemHeight, gap]
	)

	const selectThisDie = useSetAtom(selectDieAtom)

	const isAllCornerIn = useMemo(() => {
        const corners = [
            { x: positionX, y: positionY },
            { x: positionX + itemWidth, y: positionY },
            { x: positionX, y: positionY + itemHeight },
            { x: positionX + itemWidth, y: positionY + itemHeight },
        ];

        return corners.every(corner => 
            calcHypotenuse(corner.x - waferRadius, corner.y - waferRadius) <= waferRadius - gap
        );
    }, [positionX, positionY, itemWidth, itemHeight, waferRadius, gap]);

	if (!isAllCornerIn) return <></>

	return (
		<>
			{
				<rect
					id={id}
					x={positionX}
					y={positionY}
					width={itemWidth}
					height={itemHeight}
					fill={isSelected ? "#341ade" : isDefective ? "#ff6262" : "#7b818a"}
					onClick={() => selectThisDie(dieInfo)}
				/>
			}
		</>
	)
})
