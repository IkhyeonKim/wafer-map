// Virtualization: If you pass 1,000 children to it, assert that only a small "window" of them (e.g., less than 50) are actually rendered in the DOM.

import { fireEvent, render, screen } from "@testing-library/react"
import { ReactNode, useEffect, useRef } from "react"
import VirtualScrollList, { VirtualScrollHandle } from "./VirtualScrollList"
import { selectedDieAtom } from "@/lib/dieAtoms"
import { Provider, useAtomValue } from "jotai"
import SingleDie, { SingleDieProps } from "../SingleDie/SingleDie"
import { Die } from "@/lib/Die"

const mockDie: Die = new Die("die-30,9", 30, 9, false)

const mockProps: SingleDieProps = {
	dieInfo: mockDie,
	itemWidth: 15.2,
	itemHeight: 15.2,
	gap: 1,
	waferRadius: 300,
	isSelected: false,
}

const TestListItem = ({
	children,
	index,
}: {
	children: ReactNode
	index: number
}) => {
	return (
		<div role="listitem" data-testid={index}>
			{children}
		</div>
	)
}

const totalItemCount = 1000
const mockChildren = Array.from({ length: totalItemCount }, (_, i) => {
	return (
		<TestListItem key={i} index={i}>
			Item {i + 1}
		</TestListItem>
	)
})
const expectedRenderCount = 20

function VirtualScrollHarness() {
	const virtualScrollRef = useRef<VirtualScrollHandle>(null)
	return (
		<>
			<VirtualScrollList
				itemHeight={30}
				renderItemCount={expectedRenderCount}
				ref={virtualScrollRef}
			>
				{mockChildren}
			</VirtualScrollList>
		</>
	)
}

function VirtualScrollImperativeHarness() {
	const virtualScrollRef = useRef<VirtualScrollHandle>(null)

	const selectedDie = useAtomValue(selectedDieAtom)

	useEffect(() => {
		if (selectedDie) {
			virtualScrollRef.current?.scrollTo(30 * 30) // assert to move scroll to 900
		}
	}, [selectedDie])

	return (
		<div>
			<svg>
				<SingleDie {...mockProps} />
			</svg>
			<div style={{ height: 400 }}>
				<VirtualScrollList
					itemHeight={30}
					renderItemCount={expectedRenderCount}
					ref={virtualScrollRef}
					isControlled={true}
				>
					{mockChildren}
				</VirtualScrollList>
			</div>
		</div>
	)
}

describe("Virtual scroll list", () => {
	it("should only render a small 'window' of a large list", () => {
		render(
			<>
				<VirtualScrollHarness />
			</>
		)

		const renderedItems = screen.getAllByRole("listitem")

		expect(renderedItems.length).toBe(expectedRenderCount)
	})

	it("should call scrollTo and display the correct items", async () => {
		const scrollToMock = window.HTMLElement.prototype.scrollTo as jest.Mock
		scrollToMock.mockClear()

		render(
			<Provider>
				<VirtualScrollImperativeHarness />
			</Provider>
		)

		expect(screen.getByTestId("0")).toBeInTheDocument()
		expect(screen.queryByTestId("40")).not.toBeInTheDocument()

		const dieElement = screen.getByTestId("die-30,9")

		fireEvent.click(dieElement)

		expect(scrollToMock).toHaveBeenCalledTimes(1)
		expect(scrollToMock).toHaveBeenCalledWith({
			top: 900,
			left: 0,
			behavior: "smooth",
		})

		const newItem = await screen.findByTestId("40")
		expect(newItem).toBeInTheDocument()

		expect(screen.queryByTestId("0")).not.toBeInTheDocument()
	})
})
