import { Die } from "@/lib/Die"
import { useDieStore } from "@/stores/die-store-provider"

export type SingleDieProps = Die & {
	width: number
	height: number
	space: number
	positionX: number
	positionY: number
	waferRadius: number
	cx: number
	cy: number
}

function calcHypotenuse(a: number, b: number) {
	return Math.sqrt(a * a + b * b)
}

export default function SingleDie(props: SingleDieProps) {
	const {
		id,
		positionX,
		positionY,
		width,
		height,
		space,
		isDefective,
		waferRadius,
		cx,
		cy,
		isSelected,
	} = props

	const { selectDie } = useDieStore((state) => state)

	const leftTopX = positionX
	const leftTopY = positionY

	const rightTopX = positionX
	const rightTopY = positionY + width

	const leftBottomX = positionX + height
	const leftBottomY = positionY

	const rightBottomX = positionX + width
	const rightBottomY = positionY + height

	const isLeftTopCornerIn =
		calcHypotenuse(leftTopX - cx, leftTopY - cy) <= waferRadius - space
	const isRightTopCornerIn =
		calcHypotenuse(rightTopX - cx, rightTopY - cy) <= waferRadius - space
	const isLeftBottomCornerIn =
		calcHypotenuse(leftBottomX - cx, leftBottomY - cy) <= waferRadius - space
	const isRightBottomCornerIn =
		calcHypotenuse(rightBottomX - cx, rightBottomY - cy) <= waferRadius - space

	const isAllCornerIn =
		isLeftTopCornerIn &&
		isRightTopCornerIn &&
		isLeftBottomCornerIn &&
		isRightBottomCornerIn

	return (
		<>
			{isAllCornerIn ? (
				<rect
					id={id}
					x={positionX}
					y={positionY}
					width={width}
					height={height}
					fill={isSelected ? "#341ade" : "#c0c0c0"}
					onClick={() => selectDie(id)}
				/>
			) : (
				<></>
			)}
		</>
	)
}
