export type DefectInfo = {
	defectType: string
	severity: "Low" | "Medium" | "High"
	description: string
}


/**
 * Represents a single die on a wafer.
 */
export class Die {
	id: string
	x: number
	y: number
	isDefective: boolean
	isSelected: boolean
	defectInfo?: DefectInfo
	defectSize?: number
	dieMap?: Map<number, number>

	constructor(
		id: string,
		x: number,
		y: number,
		isDefective: boolean = false,
		defectSize?: number,
		defectInfo?: DefectInfo
	) {
		this.id = id
		this.x = x
		this.y = y
		this.isDefective = isDefective
		this.defectSize = defectSize
		this.isSelected = false

		if (this.isDefective && defectInfo) {
			this.defectInfo = defectInfo
		} else if (this.isDefective && !defectInfo) {
			// console.warn(
			// 	`Die ${this.id} is marked as defective, but no defectInfo was provided.`
			// )
			this.defectInfo = undefined
		} else {
			this.defectInfo = undefined
		}
	}
}
