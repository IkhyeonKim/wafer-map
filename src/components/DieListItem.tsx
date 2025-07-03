import { Die } from "@/lib/Die"
import { selectDieAtom } from "@/lib/dieAtoms"
import { useSetAtom } from "jotai"
import { memo, useCallback } from "react"

export default memo(function DieListItem({ dieInfo }: { dieInfo: Die }) {
	const { x, y, defectInfo } = dieInfo

	const selectThisDie = useSetAtom(selectDieAtom)

	const onClick = useCallback(() => {
		selectThisDie(dieInfo)
	}, [selectThisDie, dieInfo])

	return (
		<div
			className="grid grid-cols-3 text-sm h-[30px] p-1 border-b border-gray-200 cursor-pointer"
			onClick={onClick}
		>
			<div className="text-center">
				{x},{y}
			</div>
			<div className="text-center">
				{defectInfo ? defectInfo.defectType : "PASS"}
			</div>
			<div className="text-center">{defectInfo?.severity}</div>
			{/* <div>{die.isSelected ? "yes" : "no"}</div> */}
		</div>
	)
})
