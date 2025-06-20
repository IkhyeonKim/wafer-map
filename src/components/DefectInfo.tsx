"use client"

import { Die } from "@/lib/Die"
import DieList from "./DieList"

export default function DefectInfo({ dieList }: { dieList: Die[] }) {
	return (
		<section className="h-full">
			<DieList dieList={dieList} />
		</section>
	)
}
