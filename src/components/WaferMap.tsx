import { Die } from "@/lib/Die"
import WaferCanvas from "./WaferCanvas"

export default async function WaferMap({ dieList }: { dieList: Die[] }) {
	return (
		<section className="h-full flex flex-col border border-gray-300 items-center justify-center">
			<WaferCanvas dieInfo={dieList} />
		</section>
	)
}
