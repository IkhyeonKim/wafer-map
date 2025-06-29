import { atomFamily } from "jotai/utils"
import { Die } from "./Die"
import { atom } from "jotai"

export type DieAtom = Die & {
	dieIndex: number
}

export const dieAtomFamily = atomFamily(
	(dieInfo: DieAtom) => atom({ ...dieInfo }),
	(a, b) => a.id === b.id
)

export const prevSelectedDieAtom = atom<DieAtom | null>(null)

export const currentSelectedDieAtom = atom<DieAtom | null>(null)