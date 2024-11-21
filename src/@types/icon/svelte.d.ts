declare module "icon:svelte/*" {
	// TODO Deleted upon resolution, https://github.com/withastro/language-tools/issues/425
	declare module "svelte" {
		interface ComponentConstructorOptions {
			target?: Element | Document | ShadowRoot
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			[prop: string]: any
		}
	}

	import { SvelteComponent } from "svelte"
	import type { SvelteHTMLElements } from "svelte/elements"

	export default class extends SvelteComponent<SvelteHTMLElements["svg"]> {}
}
