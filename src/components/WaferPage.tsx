import { Suspense } from "react";
import WaferMap from "./WaferMap";
import DefectInfo from "./DefectInfo";
import { Die } from "@/lib/Die";

export default async function WaferPage() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL
	const data = await fetch(`${baseUrl}/api/wafer`)
	const dieList: Die[] = await data.json()

	return (
		<>
			<div className="w-full">
				<Suspense fallback={<div>This is wafer map skeleton</div>}>
					<WaferMap dieList={dieList} />
				</Suspense>
			</div>
			<div className="w-full">
				<Suspense fallback={<div>This is defect list skeleton</div>}>
					<DefectInfo dieList={dieList} />
				</Suspense>
			</div>
		</>
	)
}
