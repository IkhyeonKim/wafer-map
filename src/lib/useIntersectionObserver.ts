import { RefObject, useEffect } from "react"

type ObserverOption = {
	root: null | HTMLElement
	rootMargin: string
	threshold: number | number[]
}

type useIntersectionObserverProps = {
	triggerRef?: RefObject<HTMLElement | null>
	observerOption?: ObserverOption
	intersectionCallback?: VoidFunction
}

const defaultObserverOption: ObserverOption = {
	root: null,
	rootMargin: "100px",
	threshold: 1.0,
}

export default function useIntersectionObserver({
	triggerRef,
	intersectionCallback,
	observerOption,
}: useIntersectionObserverProps) {
	useEffect(() => {
		if (!triggerRef) return
		if (!triggerRef.current) return

		const trigger = triggerRef.current

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					if (!intersectionCallback) return
					intersectionCallback()
				}
			})
		}, observerOption || defaultObserverOption)

		if (trigger) {
			observer.observe(trigger)
		}

		return () => {
			if (trigger) observer.unobserve(trigger)
		}
	}, [intersectionCallback, observerOption, triggerRef])
}
