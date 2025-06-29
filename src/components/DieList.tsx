import { Die } from "@/lib/Die"
import DieListItem from "./DieListItem"
import VirtualScrollList, { VirtualScrollHandle } from "./VirtualScorllList"
import { useRef } from "react"
import { useAtom } from "jotai"
import { prevSelectedDieAtom } from "@/lib/dieAtoms"

export default function DieList({ dieList }: { dieList: Die[] }) {
	const virtualScrollRef = useRef<VirtualScrollHandle>(null)

	const selectedDie = useAtom(prevSelectedDieAtom)

	console.log("selectedDie", selectedDie)

	return (
		<div className="p-4 h-full">
			<button
				onClick={() => {
					virtualScrollRef.current?.scrollTo(500)
				}}
			>
				Scroll
			</button>
			<div className="grid grid-cols-3">
				<div className="text-center">Position</div>
				<div className="text-center">Defect type</div>
				<div className="text-center">Severity</div>
			</div>
			<VirtualScrollList
				itemHeight={30}
				renderItemCount={30}
				ref={virtualScrollRef}
			>
				{dieList.map((die) => {
					return <DieListItem key={die.id} dieInfo={die} />
				})}
			</VirtualScrollList>
			{/* {dieList && renderList()} */}
		</div>
	)
}
