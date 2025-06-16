import WaferCanvas from "./WaferCanvas"

export default async function WaferMap() {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL
	const data = await fetch(`${baseUrl}/api/wafer`)
	const waferData = await data.json()

	return (
		<section className="h-full flex flex-col border border-gray-300 items-center">
			<div>Wafer map</div>
			<WaferCanvas dieInfo={waferData} />
		</section>
	)
}
