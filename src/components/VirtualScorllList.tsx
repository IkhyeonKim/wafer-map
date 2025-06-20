import useIntersectionObserver from "@/lib/useIntersectionOberver"
import { useThrottle } from "@/lib/useThrottle"
import {
	Children,
	ReactNode,
	UIEventHandler,
	useCallback,
	useRef,
	useState,
} from "react"

type VirtualScrollProps = {
	children: ReactNode
	itemHeight?: number
	renderItemCount?: number
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
}: VirtualScrollProps) {
	// TODO:
	// 1. render children list
	// 2. get item height
	// 3. calculate scroll
	// 4. render specific amount of children

	const [scrollHeight, setScrollHeight] = useState<number>(0)

	const parentRef = useRef<HTMLDivElement>(null)
	const targetRef = useRef<HTMLDivElement>(null)

	const totalChildrenCnt = Children.count(children)

	useIntersectionObserver({ triggerRef: targetRef, intersectionCallback })

	const handleScroll: UIEventHandler<HTMLDivElement> = useCallback((ev) => {
		ev.stopPropagation()

		setScrollHeight(ev.currentTarget.scrollTop)
	}, [])

	const onScroll = useThrottle(handleScroll, 10)

	const renderItems = useCallback(
		(children: ReactNode) => {
			const startIndex = getStartItemIdx(scrollHeight, itemHeight)
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
		[scrollHeight, itemHeight, renderItemCount]
	)

	return (
		<div className="h-full overflow-y-auto" onScroll={onScroll}>
			<div
				ref={parentRef}
				style={{
					height: totalChildrenCnt
						? `${itemHeight * totalChildrenCnt}px`
						: "auto",
				}}
				className={`relative h-96 overflow-x-hidden overflow-y-scroll`}
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
