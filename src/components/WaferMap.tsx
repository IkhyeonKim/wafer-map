import { Die } from "@/lib/Die"
import WaferCanvas from "./WaferCanvas"

export default async function WaferMap({ dieList, mapSize }: { dieList: Die[], mapSize: number }) {
	return (
		<section className="h-full flex flex-col items-center justify-center">
			<WaferCanvas dieInfo={dieList} mapSize={mapSize} />
		</section>
	)
}
