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

	const throttleCallback = useCallback((...args: F[]) => {
		if (isThrottleRef.current) {
			return
		}

		// Fire the callback immediately.
		callbackRef.current(...args)
		// Enter the cooldown period.
		isThrottleRef.current = true

		// Set a timer to end the cooldown period.
		timeoutRef.current = setTimeout(() => {
			isThrottleRef.current = false
		}, delay)
	}, [delay])

	return throttleCallback
}
