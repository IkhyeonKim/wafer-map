import { Suspense } from "react"
import WaferPage from "@/components/WaferPage"

export default async function Home() {
	return (
		<main className="flex h-screen overflow-y-hidden">
			<Suspense fallback={<div>Fetch defect list...</div>}>
				<WaferPage />
			</Suspense>
		</main>
	)
}
