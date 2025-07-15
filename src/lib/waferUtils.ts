function calcHypotenuse(a: number, b: number) {
	return Math.sqrt(a * a + b * b)
}

export function isDieInWafer(
	dieX: number,
	dieY: number,
	itemWidth: number,
	itemHeight: number,
	gap: number,
	waferRadius: number
) {
	const positionX = dieX === 0 ? 0 : dieX * itemWidth + dieX * gap
	const positionY = dieY === 0 ? 0 : dieY * itemHeight + dieY * gap

	const corners = [
		{ x: positionX, y: positionY },
		{ x: positionX + itemWidth, y: positionY },
		{ x: positionX, y: positionY + itemHeight },
		{ x: positionX + itemWidth, y: positionY + itemHeight },
	]

	return corners.every(
		(corner) =>
			calcHypotenuse(corner.x - waferRadius, corner.y - waferRadius) <=
			waferRadius - gap
	)
}
