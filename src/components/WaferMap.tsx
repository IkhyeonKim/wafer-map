import WaferCanvas from "./WaferCanvas"

export default async function WaferMap() {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL
	const data = await fetch(`${baseUrl}/api/wafer`)
	const waferData = await data.json()

	console.log({ waferData })

	return (
		<section>
			<div>Wafer map</div>
			<WaferCanvas dieInfo={waferData} />
		</section>
	)
}
