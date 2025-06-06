"use client"

import { type ReactNode, createContext, useContext, useRef } from "react"
import { DieStore, createDieStore, initDieStore } from "./die-store"
import { useStore } from "zustand"

export type DieStoreApi = ReturnType<typeof createDieStore>

export const DieStoreContext = createContext<DieStoreApi | undefined>(
	undefined
)

export interface DieStoreProviderProps {
	children: ReactNode
}

export const DieStoreProvider = ({
	children,
}: DieStoreProviderProps) => {
	const storeRef = useRef<DieStoreApi | null>(null)
	if (storeRef.current === null) {
		storeRef.current = createDieStore(initDieStore())
	}

	return (
		<DieStoreContext.Provider value={storeRef.current}>
			{children}
		</DieStoreContext.Provider>
	)
}

export const useDieStore = <T,>(selector: (store: DieStore) => T): T => {
	const dieStoreContext = useContext(DieStoreContext)

	if (!dieStoreContext) {
		throw new Error(`useDieStore must be used within DieStoreProvider`)
	}

	return useStore(dieStoreContext, selector)
}
