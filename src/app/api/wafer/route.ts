import { DefectInfo, defectTypeArray, Die, severityArray } from "@/lib/Die"

function makeMockupData(): Die[] {
	const data: Die[] = []

	const mapSize = getMapSize()

	const maxDefectCount = mapSize
	let currentDefectCount = 0

	console.log({ mapSize, maxDefectCount })
	for (let x = 0; x < mapSize; x++) {
		for (let y = 0; y < mapSize; y++) {
			const isDefect = getIsDefect(maxDefectCount, currentDefectCount)

			if (isDefect) currentDefectCount += 1

			const defectInfo: DefectInfo = getDefectInfo()
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

function getIsDefect(
	maxDefectCount: number,
	currentDefectCount: number
): boolean {
	if (currentDefectCount >= maxDefectCount) return false

	const isDefect = !Math.floor(Math.random() * 2)

	return isDefect
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
