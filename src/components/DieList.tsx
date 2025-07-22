import { Die } from "@/lib/Die"
import DieListItem from "./DieListItem"
import VirtualScrollList, { VirtualScrollHandle } from "./VirtualScroll/VirtualScrollList"
import { useEffect, useRef } from "react"
import { useAtomValue } from "jotai"
import { selectedDieAtom } from "@/lib/dieAtoms"

const ITEM_HEIGHT = 30

export default function DieList({ dieList }: { dieList: Die[] }) {
	const virtualScrollRef = useRef<VirtualScrollHandle>(null)

	const selectedDie = useAtomValue(selectedDieAtom)

	useEffect(() => {
		if (selectedDie) {
			const dieIndex = dieList.findIndex((die) => die.id === selectedDie.id)

			if (dieIndex) virtualScrollRef.current?.scrollTo(dieIndex * ITEM_HEIGHT)
		}
	}, [dieList, selectedDie])

	return (
		<div className="h-full border-l border-r border-slate-50">
			<div className="grid grid-cols-3 border-b border-slate-200 p-2 bg-slate-800">
				<div className="text-center text-slate-50 font-bold">Position</div>
				<div className="text-center text-slate-50 font-bold">Defect type</div>
				<div className="text-center text-slate-50 font-bold">Severity</div>
			</div>
			<VirtualScrollList
				itemHeight={30}
				renderItemCount={30}
				ref={virtualScrollRef}
			>
				{dieList.map((die) => {
					return <DieListItem key={die.id} dieInfo={die} />
				})}
				{<div></div>}
			</VirtualScrollList>
		</div>
	)
}
