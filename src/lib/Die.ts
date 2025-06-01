export type DefectInfo = {
	defectType: string
	severity: "Low" | "Medium" | "High"
	description: string
}

export type DieType = {}

/**
 * Represents a single die on a wafer.
 */
export class Die {
	id: string
	x: number
	y: number
	isDefective: boolean
	defectInfo?: DefectInfo
	defectSize: number

	constructor(
		id: string,
		x: number,
		y: number,
		isDefective: boolean = false,
		defectSize: number,
		defectInfo?: DefectInfo
	) {
		this.id = id
		this.x = x
		this.y = y
		this.isDefective = isDefective
		this.defectSize = defectSize

		if (this.isDefective && defectInfo) {
			this.defectInfo = defectInfo
		} else if (this.isDefective && !defectInfo) {
			console.warn(
				`Die ${this.id} is marked as defective, but no defectInfo was provided.`
			)
		} else {
			this.defectInfo = undefined
		}
	}
}
