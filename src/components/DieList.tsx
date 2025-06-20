import { Die } from "@/lib/Die"
import DieListItem from "./DieListItem"
import VirtualScrollList from "./VirtualScorllList"

export default function DieList({ dieList }: { dieList: Die[] }) {
	return (
		<div className="p-4 h-full">
			<div></div>
			<VirtualScrollList>
				{dieList.map((die) => {
					return <DieListItem key={die.id} dieInfo={die} />
				})}
			</VirtualScrollList>
			{/* {dieList && renderList()} */}
		</div>
	)
}
