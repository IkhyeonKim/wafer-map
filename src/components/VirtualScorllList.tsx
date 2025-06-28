import useIntersectionObserver from "@/lib/useIntersectionObserver"
import { useThrottle } from "@/lib/useThrottle"
import {
	Children,
	forwardRef,
	ReactNode,
	UIEventHandler,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from "react"

type VirtualScrollProps = {
	children: ReactNode
	itemHeight?: number
	renderItemCount?: number
	classNames?: string
	intersectionCallback?: () => void
}

type VirtualScrollChildProp = {
	children: ReactNode
	top: number
}

export type VirtualScrollHandle = {
	scrollTo: (position: number) => void
}

const getStartItemIdx = (scrollHeight: number, itemHeight: number) => {
	if (scrollHeight < itemHeight) return 0

	return Math.floor(scrollHeight / itemHeight)
}

export default forwardRef<VirtualScrollHandle, VirtualScrollProps>(
	function VirtualScrollList(props, ref) {
		const {
			children,
			itemHeight = 40,
			renderItemCount = 20,
			intersectionCallback,
			classNames,
		} = props

		const [internalScrollHeight, setInternalScrollHeight] = useState<number>(0)

		const parentRef = useRef<HTMLDivElement>(null)
		const targetRef = useRef<HTMLDivElement>(null)

		const totalChildrenCnt = Children.count(children)

		useIntersectionObserver({ triggerRef: targetRef, intersectionCallback })

		useImperativeHandle(
			ref,
			() => {
				return {
					scrollTo(position) {
						if (parentRef.current) {
							parentRef.current.scrollTo({
								top: position,
								left: 0,
								behavior: "smooth",
							})
						}
					},
				}
			},
			[]
		)

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
			<div
				ref={parentRef}
				className={`h-full overflow-y-auto overflow-x-hidden ${classNames}`}
				onScroll={onScroll}
			>
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
)

// export default function VirtualScrollList(
// 	props: VirtualScrollProps,
// 	ref: Ref<VirtualScrollHandle>
// ) {

// }

function VirtualScrollChild({ children, top }: VirtualScrollChildProp) {
	return (
		<div style={{ top: `${top}px` }} className="absolute w-full">
			{children}
		</div>
	)
}
