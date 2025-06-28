import useIntersectionObserver from "@/lib/useIntersectionObserver"
import { useThrottle } from "@/lib/useThrottle"
import {
	Children,
	ReactNode,
	UIEventHandler,
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
} from "react"

type VirtualScrollProps = {
	children: ReactNode
	itemHeight?: number
	renderItemCount?: number
	scrollToHeight?: number
	classNames?: string
	intersectionCallback?: () => void
}

type VirtualScrollChildProp = {
	children: ReactNode
	top: number
}

const getStartItemIdx = (scrollHeight: number, itemHeight: number) => {
	if (scrollHeight < itemHeight) return 0

	return Math.floor(scrollHeight / itemHeight)
}

export default function VirtualScrollList({
	children,
	itemHeight = 40,
	renderItemCount = 20,
	intersectionCallback,
	scrollToHeight,
	classNames,
}: VirtualScrollProps) {
	const isControlled = scrollToHeight !== undefined
	const [internalScrollHeight, setInternalScrollHeight] = useState<number>(
		scrollToHeight || 0
	)

	// If the component is controlled, use the prop. Otherwise, use our internal state.
	const effectiveScrollHeight = isControlled
		? scrollToHeight
		: internalScrollHeight

	const parentRef = useRef<HTMLDivElement>(null)
	const targetRef = useRef<HTMLDivElement>(null)

	const totalChildrenCnt = Children.count(children)

	useIntersectionObserver({ triggerRef: targetRef, intersectionCallback })

	useLayoutEffect(() => {
		if (
			parentRef.current &&
			parentRef.current.scrollTop !== effectiveScrollHeight
		) {
			parentRef.current.scrollTo({
				top: effectiveScrollHeight,
				left: 0,
				behavior: "smooth",
			})
		}
	}, [effectiveScrollHeight])

	const handleScroll: UIEventHandler<HTMLDivElement> = useCallback((ev) => {
		ev.stopPropagation()

		setInternalScrollHeight(ev.currentTarget.scrollTop)
	}, [])

	const onScroll = useThrottle(handleScroll, 5)

	const renderItems = useCallback(
		(children: ReactNode) => {
			const startIndex = getStartItemIdx(internalScrollHeight, itemHeight)
			const endIndex = startIndex + renderItemCount

			return Children.toArray(children)
				.slice(startIndex, endIndex)
				.map((child, idx) => {
					const current = startIndex + idx
					return (
						<VirtualScrollChild key={current} top={current * itemHeight}>
							{child}
						</VirtualScrollChild>
					)
				})
		},
		[internalScrollHeight, itemHeight, renderItemCount]
	)

	return (
		<div ref={parentRef} className={`h-full overflow-y-auto overflow-x-hidden ${classNames}`} onScroll={onScroll}>
			<div
				style={{
                    position: "relative",
					height: totalChildrenCnt
						? `${itemHeight * totalChildrenCnt}px`
						: "auto",
				}}
			>
				{children && renderItems(children)}
				<div
					key="scrollEnd"
					id="virtual-scroll"
					ref={targetRef}
					className="absolute bottom-0 w-full"
				/>
			</div>
		</div>
	)
}

function VirtualScrollChild({ children, top }: VirtualScrollChildProp) {
	return (
		<div style={{ top: `${top}px` }} className="absolute w-full">
			{children}
		</div>
	)
}
