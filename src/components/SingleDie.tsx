import { Die } from "@/lib/Die"
import { useEffect, useMemo } from "react"
import { atom, useAtom } from "jotai"
import { dieAtomFamily } from "@/lib/useDies"
import { stableIsDraggedAtom } from "./Zoomable"

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
	renderingInfo: DieRenderingInfo
}

function calcHypotenuse(a: number, b: number) {
	return Math.sqrt(a * a + b * b)
}

export default function SingleDie(props: SingleDieProps) {
	const { renderingInfo, dieInfo } = props

	const { positionX, positionY, width, height, space, waferRadius, cx, cy } =
		renderingInfo

	const { id } = dieInfo

	const dieAtom = useMemo(
		() =>
			atom(
				(get) => {
					return get(dieAtomFamily(dieInfo))
				},
				(get, set) => {
					const isDragged = get(stableIsDraggedAtom)
					if (isDragged) return

					const prev = get(dieAtomFamily(dieInfo))
					set(dieAtomFamily(dieInfo), { ...prev, isSelected: !prev.isSelected })
				}
			),

		[dieInfo]
	)

	const [myDie, selectDie] = useAtom(dieAtom)

	const { isSelected } = myDie

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

	useEffect(() => {
		return () => {
			// TODO: remove atom
		}
	}, [])

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
					onClick={() => selectDie()}
				/>
			) : (
				<></>
			)}
		</>
	)
}
