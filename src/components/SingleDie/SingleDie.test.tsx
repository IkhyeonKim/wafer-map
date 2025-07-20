import { render, screen, fireEvent } from "@testing-library/react"
import { Die } from "@/lib/Die"
import SingleDie, { SingleDieProps } from "./SingleDie"
import { Provider, useAtomValue } from "jotai"
import { selectedDieAtom } from "@/lib/dieAtoms"
import { memo } from "react"

const mockDie: Die = new Die("die-30,9", 30, 9, false)
const mockDie2: Die = new Die("die-30,10", 30, 10, false)

const mockProps: SingleDieProps = {
	dieInfo: mockDie,
	itemWidth: 15.2,
	itemHeight: 15.2,
	gap: 1,
	waferRadius: 300,
	isSelected: false,
}
const mockProps2: SingleDieProps = {
	dieInfo: mockDie2,
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

function SingleDieTestHarness() {
	// 1. It subscribes to the global atom
	const selected = useAtomValue(selectedDieAtom)

	// 2. It renders the SingleDie and calculates the isSelected prop
	//    based on the current atom value.
	return (
		<svg>
			<SingleDie {...mockProps} isSelected={selected?.id === mockDie.id} />
		</svg>
	)
}

const die1RenderSpy = jest.fn()
const die2RenderSpy = jest.fn()

type SpySingleDieProps = SingleDieProps & {
    renderSpy: () => void;
};

const SpyingSingleDie = memo(function spySingleDie({
	renderSpy,
	...restOfProps
}: SpySingleDieProps) {
	renderSpy()
	return <SingleDie {...restOfProps} />
})

function DoubleDieTestHarness() {
	const selected = useAtomValue(selectedDieAtom)
	return (
		<svg>
			<SpyingSingleDie
				renderSpy={die1RenderSpy}
				{...mockProps}
				isSelected={selected?.id === mockDie.id}
			/>
			<SpyingSingleDie
				renderSpy={die2RenderSpy}
				{...mockProps2}
				isSelected={selected?.id === mockDie2.id}
			/>
		</svg>
	)
}

describe("Single Die Component", () => {
	it("initial Render", () => {
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

		const dieElement = screen.getByTestId("die-30,9")

		expect(dieElement)
	})

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
		const dieElement = screen.getByTestId("die-30,9")
		const display = screen.getByTestId("selected-display")

		// 3.
		expect(display.textContent).toEqual("none")

		fireEvent.click(dieElement)

		expect(display.textContent).toEqual("die-30,9")
	})

	it("should update the color of the rect when clicked", () => {
		render(
			<Provider>
				<SingleDieTestHarness />
			</Provider>
		)
		// screen.debug()
		// 2. Find the elements
		const dieElement = screen.getByTestId("die-30,9")
		expect(dieElement).toHaveAttribute("fill", "#7b818a")

		// 3. Fire the click event
		fireEvent.click(dieElement)

		// 4. Check the fill attribute is "#341ade"
		expect(dieElement).toHaveAttribute("fill", "#341ade")
	})

	beforeEach(() => {
		// Reset spies before each test
		die1RenderSpy.mockClear()
		die2RenderSpy.mockClear()
	})

	it("should not re-render if props have not changed", () => {
		render(
			<Provider>
				<DoubleDieTestHarness />
			</Provider>
		)

        expect(die1RenderSpy).toHaveBeenCalledTimes(1);
        expect(die2RenderSpy).toHaveBeenCalledTimes(1);

        const die2Element = screen.getByTestId("die-30,10");

        fireEvent.click(die2Element);

        expect(die1RenderSpy).toHaveBeenCalledTimes(1);
        expect(die2RenderSpy).toHaveBeenCalledTimes(2);
	})
})
