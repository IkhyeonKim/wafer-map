import { Die } from "./Die"

export type DieSeverityProps = {
	die: Die
}

export function useDieSeverity(die: Die) {
	const { defectInfo } = die

	if (!defectInfo) return ""

	const { severity } = defectInfo

	if (severity === "High") return "#dc2626"
	if (severity === "Medium") return "#fd8939"
	if (severity === "Low") return "#ffd567"

    return ""
}
