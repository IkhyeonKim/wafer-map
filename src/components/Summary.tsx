import { Die } from "@/lib/Die"

export default function Summary({ dieList }: { dieList: Die[] }) {
    const dieCount = dieList.length
	const defectCount = dieList.filter((die) => die.isDefective).length

	return (
		<div className="text-slate-50">
			{/* <h2 className="font-semibold">Summary</h2> */}
			<div className="grid grid-cols-3 divide-x-1 w-full">
				<div className="text-center">
					<div>Total dies</div>
					<div>{dieCount}</div>
				</div>
				<div className="text-center">
					<div>Total defects</div>
					<div>{defectCount}</div>
				</div>
				<div className="text-center">
					<div>Yield</div>
					<div>{((dieCount - defectCount) / dieCount * 100).toFixed(2)}%</div>
				</div>
			</div>
		</div>
	)
}
