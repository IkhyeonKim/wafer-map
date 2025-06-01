import WaferMap from "@/components/WaferMap"
import DefectInfo from "@/components/DefectInfo"

export default function Home() {
	return (
		<main className="flex h-screen">
			<div className="w-full">
				<WaferMap />
			</div>
			<div className="w-full">
				<DefectInfo />
			</div>
		</main>
	)
}
