import { render, screen, fireEvent } from "@testing-library/react"
import { Die } from "@/lib/Die"
import SingleDie, { SingleDieProps } from "./SingleDie"
import { Provider, useAtomValue } from "jotai"
import { selectedDieAtom } from "@/lib/dieAtoms"

const mockDie: Die = new Die("die-30,9", 30, 9, false)
const mockProps: SingleDieProps = {
	dieInfo: mockDie,
	itemWidth: 15.2,
	itemHeight: 15.2,
	gap: 1,
	waferRadius: 300,
	isSelected: false,
}

function SelectedDieDisplay() {
	const selectedDie = useAtomValue(selectedDieAtom)
	return <div data-testid="selected-display">{selectedDie?.id || "none"}</div>
}

describe("Single Die Component", () => {
	it("should update the global selectedDieAtom when clicked", () => {
		render(
			<Provider>
				<div>
					<svg>
						<SingleDie {...mockProps} />
					</svg>
				</div>
				<SelectedDieDisplay />
			</Provider>
		)
		// screen.debug()
		// 2. Find the elements
		const rectElement = screen.getByTestId("die-30,9")
		const display = screen.getByTestId("selected-display")

		// 3.
		expect(display.textContent).toEqual("none")

		fireEvent.click(rectElement)

		expect(display.textContent).toEqual("die-30,9")
	})
})
