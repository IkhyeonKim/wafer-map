// Virtualization: If you pass 1,000 children to it, assert that only a small "window" of them (e.g., less than 50) are actually rendered in the DOM.

import { render, screen } from "@testing-library/react"
import { ReactNode, useRef } from "react"
import VirtualScrollList, { VirtualScrollHandle } from "./VirtualScrollList"

const TestListItem = ({ children }: { children: ReactNode }) => {
	return <div role="listitem">{children}</div>
}

const totalItemCount = 1000
const mockChildren = Array.from({ length: totalItemCount }, (_, i) => {
	return <TestListItem key={i}>Item {i + 1}</TestListItem>
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

describe("Virtual scroll list", () => {
	it("should only render a small 'window' of a large list", () => {
		render(
			<>
				<VirtualScrollHarness />
			</>
		)

		const renderedItems = screen.getAllByRole("listitem")

		expect(renderedItems.length).toBeLessThan(totalItemCount)
	})
})
