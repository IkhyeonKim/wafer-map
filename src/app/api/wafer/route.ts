import { DefectInfo, defectTypeArray, Die, severityArray } from "@/lib/Die"

function shuffleArray<T>(array: T[]): T[] {
	const newArray = [...array]
	for (let i = newArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))

		;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
	}
	return newArray
}

function makeMockupData(): Die[] {
	const data: Die[] = []

	const mapSize = getMapSize()
	const totalCells = mapSize * mapSize

	const desiredDefectCount = Math.floor(totalCells * 0.05)

	const allCoords: { x: number; y: number }[] = []
	for (let x = 0; x < mapSize; x++) {
		for (let y = 0; y < mapSize; y++) {
			allCoords.push({ x, y })
		}
	}
	const shuffledCoords = shuffleArray(allCoords)

	const defectLocations = new Set<string>()
	shuffledCoords.slice(0, desiredDefectCount).forEach((coord) => {
		// Store as a "x,y" string for easy lookup
		defectLocations.add(`${coord.x},${coord.y}`)
	})

	for (let x = 0; x < mapSize; x++) {
		for (let y = 0; y < mapSize; y++) {
			const coordKey = `${x},${y}`
			const isDefect = defectLocations.has(coordKey)

			// Only generate detailed defect info if it's actually a defect
			const defectInfo = isDefect ? getDefectInfo() : undefined

			const die = new Die(`die-${x},${y}`, x, y, isDefect, defectInfo)
			data.push(die)
		}
	}

	return data
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
	const minMapSize = 10
	const maxMapSize = 50
	let mapSize = 0

	while (mapSize < minMapSize) {
		mapSize = Math.floor(Math.random() * maxMapSize)
	}

	return mapSize
}

export async function GET() {
	const data: Die[] = makeMockupData()

	return new Response(JSON.stringify(data), {
		status: 200,
		headers: {
			"Content-type": "application/json",
		},
	})
}
