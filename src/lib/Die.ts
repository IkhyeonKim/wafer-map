export const defectTypeArray = ["A", "B", "C", "D", "E"] as const
export const severityArray = ["Low", "Medium", "High"] as const

type DefectType = (typeof defectTypeArray)[number] // "A" | "B" | "C" | "D" | "E"
type Severity = (typeof severityArray)[number] // "Low" | "Medium" | "High"

export type DefectInfo = {
	defectType: DefectType
	severity: Severity
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
		defectInfo?: DefectInfo,
		defectSize?: number
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
