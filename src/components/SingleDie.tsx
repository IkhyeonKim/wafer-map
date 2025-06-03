import { Die } from "@/lib/Die"

export default function SingleDie(props: Die) {
	const { id } = props
	return <rect id={id}></rect>
}
