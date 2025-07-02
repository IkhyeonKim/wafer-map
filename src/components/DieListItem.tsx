import { Die } from "@/lib/Die"
import { DieAtom, dieAtomFamily, prevSelectedDieAtom } from "@/lib/dieAtoms"
import { useAtom } from "jotai"
import { atom } from "jotai"
import { memo, useCallback, useMemo } from "react"

export default memo(function DieListItem({
	dieInfo,
	dieIndex,
}: {
	dieInfo: Die
	dieIndex: number
}) {
	const dieAtomInfo: DieAtom = useMemo(() => {
		return {
			...dieInfo,
			dieIndex,
			shouldMoveScroll: false,
		}
	}, [dieIndex, dieInfo])

	const dieAtom = useMemo(
		() =>
			atom(
				(get) => {
					return get(dieAtomFamily(dieAtomInfo))
				},
				(get, set) => {
					const prev = get(dieAtomFamily(dieAtomInfo))
					const newDieInfo = {
						...prev,
						isSelected: !prev.isSelected,
						shouldMoveScroll: false,
					}

					set(dieAtomFamily(dieAtomInfo), newDieInfo)

					const previouslySelect = get(prevSelectedDieAtom)
					if (previouslySelect) {
						const prevDieAtom = get(dieAtomFamily(previouslySelect))
						set(dieAtomFamily(prevDieAtom), {
							...prevDieAtom,
							isSelected: false,
						})
					}

					set(prevSelectedDieAtom, newDieInfo)
				}
			),

		[dieAtomInfo]
	)
	const [die, selectDie] = useAtom(dieAtom)

	const onClick = useCallback(() => {
		selectDie()
	}, [selectDie])

	return (
		<div
			className="grid grid-cols-3 text-sm h-[30px] p-1 border-b border-gray-200 cursor-pointer"
			onClick={onClick}
		>
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
