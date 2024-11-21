import { FileSystemIconLoader } from "unplugin-icons/loaders"

export const customCollections = {
	my: FileSystemIconLoader("./public/icon", (svg) =>
		svg.replace(/^<svg /, '<svg fill="currentColor" '),
	),
}

export const defaultStyle =
	"--icon-size: var(--i-size, unset); width: var(--i-w, var(--icon-size)); height: var(--i-h, var(--icon-size))"

export const extraProperties = {
	"--icon-size": "var(--i-size, 1em)",
	width: "var(--i-w, var(--icon-size))",
	height: "var(--i-h, var(--icon-size))",
}
