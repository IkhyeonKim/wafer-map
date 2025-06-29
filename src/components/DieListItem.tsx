import { Die } from "@/lib/Die"
import { dieAtomFamily } from "@/lib/dieAtoms"
import { useAtom } from "jotai"
import { atom } from "jotai"
import { memo, useMemo } from "react"

export default memo(function DieListItem({
	dieInfo,
	dieIndex,
}: {
	dieInfo: Die
	dieIndex: number
}) {
	const dieAtomInfo = useMemo(() => {
		return {
			...dieInfo,
			dieIndex,
		}
	}, [dieIndex, dieInfo])

	const dieAtom = useMemo(
		() =>
			atom(
				(get) => {
					return get(dieAtomFamily(dieAtomInfo))
				}
				// (get, set) => {
				// 	const isDragged = get(stableIsDraggedAtom)
				// 	if (isDragged) return

				// 	const prev = get(dieAtomFamily(dieInfo))
				// 	set(dieAtomFamily(dieInfo), { ...prev, isSelected: !prev.isSelected })
				// }
			),

		[dieAtomInfo]
	)

	const [die] = useAtom(dieAtom)
	return (
		<div className="grid grid-cols-3 text-sm h-[30px] p-1 border-b border-gray-200">
			<div className="text-center">
				{die.x},{die.y}
			</div>
			<div className="text-center">
				{die.defectInfo ? die.defectInfo.defectType : "PASS"}
			</div>
			<div className="text-center">{die.defectInfo?.severity}</div>
			{/* <div>{die.isSelected ? "yes" : "no"}</div> */}
		</div>
	)
})
