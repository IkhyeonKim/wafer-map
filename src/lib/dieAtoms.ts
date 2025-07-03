import { atomFamily } from "jotai/utils"
import { Die } from "./Die"
import { atom } from "jotai"
import { stableIsDraggedAtom } from "@/components/Zoomable"

export type DieAtom = Die & {
	dieIndex: number
	shouldMoveScroll: boolean
}

export const dieAtomFamily = atomFamily(
	(dieInfo: DieAtom) => atom({ ...dieInfo }),
	(a, b) => a.id === b.id
)

export const prevSelectedDieAtom = atom<DieAtom | null>(null)

export const currentSelectedDieAtom = atom<DieAtom | null>(null)

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
