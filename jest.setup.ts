import "@testing-library/jest-dom"

let intersectionCallback: IntersectionObserverCallback

// This is our more advanced mock class.
class MockIntersectionObserver implements IntersectionObserver {
	readonly root: Element | null = null
	readonly rootMargin: string = "0px"
	readonly thresholds: readonly number[] = [0]

	// The constructor will be called with a callback, just like the real one.
	constructor(callback: IntersectionObserverCallback) {
		// We save the callback so our test can trigger it manually.
		intersectionCallback = callback
	}

	// These are mock functions that we can inspect in tests if needed.
	observe = jest.fn()
	unobserve = jest.fn()
	disconnect = jest.fn()
	takeRecords = jest.fn((): IntersectionObserverEntry[] => [])
}

declare global {
	function mockIntersection(entry: { isIntersecting: boolean }): void
}

global.mockIntersection = (entry: { isIntersecting: boolean }) => {
	// When called, it will execute the saved callback, passing a fake
	// entry object that matches the IntersectionObserverEntry interface.
	intersectionCallback(
		[entry as IntersectionObserverEntry],
		new MockIntersectionObserver(intersectionCallback)
	)
}

// Make the mock available globally for your components to use.
window.IntersectionObserver = MockIntersectionObserver

window.HTMLElement.prototype.scrollTo = jest.fn();
