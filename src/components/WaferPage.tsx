import { Suspense } from "react"
import WaferMap from "./WaferMap"
import DefectInfo from "./DefectInfo"
import { Die } from "@/lib/Die"
import Summary from "./Summary"

export default async function WaferPage() {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL
	const data = await fetch(`${baseUrl}/api/wafer`)
	const dieList: Die[] = await data.json()

	return (
		<section className="w-full h-full flex">
			<div className="w-full flex flex-col bg-slate-800 px-4 py-8">
				<Suspense fallback={<div></div>}>
					<Summary dieList={dieList} />
				</Suspense>
				<Suspense fallback={<div>This is wafer map skeleton</div>}>
					<WaferMap dieList={dieList} />
				</Suspense>
			</div>
			<div className="w-full bg-slate-800">
				<Suspense fallback={<div>This is defect list skeleton</div>}>
					<DefectInfo dieList={dieList} />
				</Suspense>
			</div>
		</section>
	)
}
