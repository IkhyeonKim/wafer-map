import { atomFamily } from "jotai/utils"
import { Die } from "./Die"
import { atom } from "jotai"

export const dieAtomFamily = atomFamily(
	(dieInfo: Die) => atom({ ...dieInfo }),
	(a, b) => a.id === b.id
)

export const prevSelectedDieAtom = atom<Die | null>(null)