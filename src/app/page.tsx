import WaferMap from "@/components/WaferMap"
import DefectInfo from "@/components/DefectInfo"
import { Suspense } from "react"

export default function Home() {
	return (
		<main className="flex h-screen">
			<div className="w-full">
				<Suspense fallback={<div>This is wafer map skeleton</div>}>
					<WaferMap />
				</Suspense>
			</div>
			<div className="w-full">
				<DefectInfo />
			</div>
		</main>
	)
}
