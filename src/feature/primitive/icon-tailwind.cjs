/**
 * The following configuration is required when using Iconify and custom icons with Tailwind CSS.
 *
 * https://github.com/egoist/tailwindcss-icons/issues/37#issuecomment-2026939421
 *
 * ```bash
 * npm install @egoist/tailwindcss-icons @iconify/tools @iconify/types @iconify/utils
 * ```
 *
 * ```ts
 * const { getIconCollections, iconsPlugin } = require("@egoist/tailwindcss-icons")
 * const { getCollections } = require("#@/feature/primitive/icon-tailwind.cjs")
 *
 * //...
 *
 * 	plugins: [
 * 		iconsPlugin({
 * 			collections: {
 * 				...getIconCollections(["lucide"]),
 * 				...getCollections({
 * 					my: `${__dirname}/public/asset/icon`,
 * 				}),
 * 			},
 * 		}),
 * 	],
 */

const {
	cleanupSVG,
	importDirectorySync,
	isEmptyColor,
	parseColors,
	runSVGO,
} = require("@iconify/tools")
const { compareColors, stringToColor } = require("@iconify/utils/lib/colors")

/**
 * @param {Record<string, string>} targets
 * @returns {Record<string, import("@iconify/types").IconifyJSON>}
 */
exports.getCollections = function getCollections(targets) {
	/** @type {Record<string, import("@iconify/types").IconifyJSON>} */
	const collections = {}

	for (const [name, dir] of Object.entries(targets)) {
		// Import icons
		const iconSet = importDirectorySync(dir, {
			includeSubDirs: false,
		})

		// Validate, clean up, fix palette and optimize
		iconSet.forEachSync((name, type) => {
			if (type !== "icon") return

			const svg = iconSet.toSVG(name)
			if (!svg) {
				// Invalid icon
				iconSet.remove(name)
				return
			}

			// Clean up and optimize icons
			try {
				// Clean up icon code
				cleanupSVG(svg)

				// Change color to `currentColor`
				// Skip this step if icon has hardcoded palette
				const blackColor = stringToColor("black")
				const whiteColor = stringToColor("white")

				parseColors(svg, {
					defaultColor: "currentColor",
					callback: (attr, colorStr, color) => {
						if (!color) {
							// Color cannot be parsed!
							throw new Error(
								`Invalid color: "${colorStr}" in attribute ${attr}`,
							)
						}

						if (isEmptyColor(color)) {
							// Color is empty: 'none' or 'transparent'. Return as is
							return color
						}

						// Change black to 'currentColor'
						if (compareColors(color, blackColor))
							return "currentColor"

						// Remove shapes with white color
						if (compareColors(color, whiteColor)) return "remove"

						// Icon is not monotone
						return color
					},
				})

				// Optimize
				runSVGO(svg)
			} catch (err) {
				// Invalid icon
				console.error(`Error parsing ${name}:`, err)
				iconSet.remove(name)
				return
			}

			// Update icon
			iconSet.fromSVG(name, svg)
		})

		collections[name] = iconSet.export()
	}

	return collections
}
