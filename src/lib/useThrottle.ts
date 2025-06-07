import { useCallback, useEffect, useRef } from "react"

export function useThrottle<F extends (...args: any[]) => void>(
	func: F,
	delay: number
) {
	const callbackRef = useRef(func)
	const isThrottleRef = useRef(false)

	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		callbackRef.current = func
	}, [func])

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [])

	const throttleCallback = useCallback(
		(...args: Parameters<F>) => {
			if (isThrottleRef.current) {
				return
			}

			callbackRef.current(...args)

			isThrottleRef.current = true

			timeoutRef.current = setTimeout(() => {
				isThrottleRef.current = false
			}, delay)
		},
		[delay]
	)

	return throttleCallback
}
