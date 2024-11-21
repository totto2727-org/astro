import {
	defineConfig,
	mergeConfigs,
	presetIcons,
	presetUno,
	transformerDirectives,
	transformerVariantGroup,
} from "unocss"

import { customCollections } from "./src/feature/primitive/icon-unocss.js"

export default mergeConfigs([
	defineConfig({
		transformers: [transformerDirectives(), transformerVariantGroup()],
		presets: [
			presetUno(),
			presetIcons({
				collections: customCollections,
				// TODO: link astro -> defaultStyle
				// https://github.com/unocss/unocss/issues/4084
				// extraProperties
			}),
		],
	}),
])
