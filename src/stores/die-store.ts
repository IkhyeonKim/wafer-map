import { Die } from "@/lib/Die"
import { createStore } from "zustand"

export type DiesState = {
	dies: Die[]
}

export type DieActions = {
	// increment: () => void
	selectDie: (dieId: string) => void
	initDie: (dies: Die[]) => void
}

export type DieStore = DiesState & DieActions

export const defaultInitState: DiesState = {
	dies: [],
}

export const initDieStore = (): DiesState => {
	return { dies: [] }
}

export const createDieStore = (initState: DiesState = defaultInitState) => {
	return createStore<DieStore>()((set) => ({
		...initState,
		// decrement: () => set((state) => ({ count: state.count - 1 })),
		selectDie: (dieId: string) =>
			set((state) => ({
				dies: state.dies.map((die) => {
					return dieId === die.id
						? {
								...die,
								isSelected: !die.isSelected,
						  }
						: die
				}),
			})),
		initDie: (dies: Die[]) =>
			set(() => ({
				dies: [...dies],
			})),
	}))
}
