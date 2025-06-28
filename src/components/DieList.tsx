import { Die } from "@/lib/Die"
import DieListItem from "./DieListItem"
import VirtualScrollList, { VirtualScrollHandle } from "./VirtualScorllList"
import { useRef } from "react"

export default function DieList({ dieList }: { dieList: Die[] }) {
	// const [scrollHeight, setScrollHeight] = useState(0)
	const virtualScrollRef = useRef<VirtualScrollHandle>(null)
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
				// scrollToHeight={scrollHeight}
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
