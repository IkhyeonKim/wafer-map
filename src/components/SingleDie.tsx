import { Die } from "@/lib/Die"

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
	} = props
	// corner1 = (rectangle.x, rectangle.y)
	// corner2 = (rectangle.x + rectangle.width, rectangle.y)
	// corner3 = (rectangle.x, rectangle.y + rectangle.height)
	// corner4 = (rectangle.x + rectangle.width, rectangle.y + rectangle.height)
	//
	// is_corner1_in = SQRT((corner1.x - circle_cx)^2 + (corner1.y - circle_cy)^2) <= circle_radius
	// is_corner2_in = SQRT((corner2.x - circle_cx)^2 + (corner2.y - circle_cy)^2) <= circle_radius
	// is_corner3_in = SQRT((corner3.x - circle_cx)^2 + (corner3.y - circle_cy)^2) <= circle_radius
	// is_corner4_in = SQRT((corner4.x - circle_cx)^2 + (corner4.y - circle_cy)^2) <= circle_radius

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
					fill={isDefective ? "#de1a1a" : "#c0c0c0"}
				/>
			) : (
				<></>
			)}
		</>
	)
}
