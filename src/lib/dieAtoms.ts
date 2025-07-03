import { atomFamily } from "jotai/utils"
import { Die } from "./Die"
import { atom } from "jotai"
import { stableIsDraggedAtom } from "@/components/Zoomable"

export const dieAtomFamily = atomFamily(
	(dieInfo: Die) => atom({ ...dieInfo }),
	(a, b) => a.id === b.id
)

export const selectedDieAtom = atom<Die | null>(null)

export const selectDieAtom = atom(
	null,
	(get, set, clickedDie: Die) => {
		const isDragged = get(stableIsDraggedAtom)
		if (isDragged) return

		const currentlySelected = get(selectedDieAtom)

		if (currentlySelected?.id !== clickedDie.id) {
			set(selectedDieAtom, clickedDie)
		} else {
			set(selectedDieAtom, null)
		}
	}
)
