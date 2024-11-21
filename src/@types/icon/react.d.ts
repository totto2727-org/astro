declare module "icon:react/*" {
	import type { SVGProps } from "react"
	import type { ReactElement } from "react"

	const component: (props: SVGProps<SVGSVGElement>) => ReactElement
	export default component
}
