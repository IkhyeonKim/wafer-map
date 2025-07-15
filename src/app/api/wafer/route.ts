import { DefectInfo, defectTypeArray, Die, severityArray } from "@/lib/Die"
import { isDieInWafer } from "@/lib/waferUtils"

export type DieDataResponse = {
	dieList: Die[],
	mapSize: number
}

function shuffleArray<T>(array: T[]): T[] {
	const newArray = [...array]
	for (let i = newArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))

		;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
	}
	return newArray
}

function makeMockupData(
	canvasSize: number,
	waferRadius: number,
	gapWidth: number
): DieDataResponse {

	// const data = []

	const mapSize = getMapSize()
	const singleDieWidth = (canvasSize - mapSize * gapWidth) / mapSize
	// const totalCells = mapSize * mapSize
	// const desiredDefectCount = Math.floor(totalCells * 0.05)

	const validCoords: { x: number; y: number }[] = []
	for (let x = 0; x < mapSize; x++) {
		for (let y = 0; y < mapSize; y++) {
			if (
				isDieInWafer(
					x,
					y,
					singleDieWidth,
					singleDieWidth,
					gapWidth,
					waferRadius
				)
			) {
				validCoords.push({ x, y })
			}
		}
	}
	const totalValidDies = validCoords.length;
    const desiredDefectCount = Math.floor(totalValidDies * 0.05); // 5% defect rate
    const shuffledValidCoords = shuffleArray(validCoords);
    
    const defectLocations = new Set<string>();
    shuffledValidCoords.slice(0, desiredDefectCount).forEach(coord => {
        defectLocations.add(`${coord.x},${coord.y}`);
    });

	// for (let x = 0; x < mapSize; x++) {
	// 	for (let y = 0; y < mapSize; y++) {
	// 		const coordKey = `${x},${y}`
	// 		const isDefect = defectLocations.has(coordKey)

	// 		// Only generate detailed defect info if it's actually a defect
	// 		const defectInfo = isDefect ? getDefectInfo() : undefined

	// 		const die = new Die(`die-${x},${y}`, x, y, isDefect, defectInfo)
	// 		data.push(die)
	// 	}
	// }

	const data: Die[] = validCoords.map(({ x, y }) => {
        const coordKey = `${x},${y}`;
        const isDefect = defectLocations.has(coordKey);
        const defectInfo = isDefect ? getDefectInfo() : undefined;

        return new Die(`die-${x},${y}`, x, y, isDefect, defectInfo);
    });

	return {
		dieList: data,
		mapSize
	}
}

function getDefectInfo(): DefectInfo {
	const randomType = Math.floor(Math.random() * defectTypeArray.length)

	const randomSeverity =
		severityArray[Math.floor(Math.random() * severityArray.length)]

	return {
		defectType: defectTypeArray[randomType],
		severity: randomSeverity,
		description: "",
	}
}

function getMapSize(): number {
	const minMapSize = 20
	const maxMapSize = 70
	let mapSize = 0

	while (mapSize < minMapSize) {
		mapSize = Math.floor(Math.random() * maxMapSize)
	}

	return mapSize
}

export async function GET() {
	const data: DieDataResponse = makeMockupData(600, 300, 1)

	return new Response(JSON.stringify(data), {
		status: 200,
		headers: {
			"Content-type": "application/json",
		},
	})
}
