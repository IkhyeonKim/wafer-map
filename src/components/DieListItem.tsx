import { Die } from "@/lib/Die"
import { dieAtomFamily } from "@/lib/useDies"
import { useAtom } from "jotai"
import { atom } from "jotai"
import { useMemo } from "react"

export default function DieListItem({ dieInfo }: { dieInfo: Die }) {
	const dieAtom = useMemo(
		() =>
			atom(
				(get) => {
					return get(dieAtomFamily(dieInfo))
				}
				// (get, set) => {
				// 	const isDragged = get(stableIsDraggedAtom)
				// 	if (isDragged) return

				// 	const prev = get(dieAtomFamily(dieInfo))
				// 	set(dieAtomFamily(dieInfo), { ...prev, isSelected: !prev.isSelected })
				// }
			),

		[dieInfo]
	)

	const [die] = useAtom(dieAtom)
	return (
		<div className="grid grid-cols-3 text-sm h-[30px]">
			<div className="text-center">{die.x},{die.y}</div>
            <div className="text-center">
                {die.defectInfo ? die.defectInfo.defectType : "PASS"}
            </div>
			<div className="text-center">{die.defectInfo?.severity}</div>
            {/* <div>{die.isSelected ? "yes" : "no"}</div> */}
		</div>
	)
}
