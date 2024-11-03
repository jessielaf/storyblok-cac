import { promises as fsPromises } from 'node:fs'
import type { StoryblokConfig } from './types.js'

export function generateComponents(config: StoryblokConfig) {
	return {
		components: config.components.map(({ presets, ...component }) => ({
			...component,
			real_name: component.name,
			is_root: component.is_root ?? false,
			is_nestable: component.is_nestable ?? true,
			internal_tag_ids: [], // without this it wont work
			internal_tags_list: [], // without this it wont work
			all_presets: presets?.map(preset => ({ name: preset.name })) ?? [],
			schema: Object.fromEntries(
				Object.entries(component.schema).map(([key, value], index) => {
					const pos = index + 1

					if (value.type === 'tab') {
						// Tabs have ids in them inserted. We force this by creating the tabId
						const { tabId, ...restValues } = value
						key = `${key}-${tabId}`
						return [key, { pos, ...restValues }]
					} else if (value.type === 'bloks') {
						// If a component whitelist is provided, we need to add the restrict_components property
						if (value.component_whitelist && value.component_whitelist.length) {
							;(value as any).restrict_components = true
						}
					}

					return [key, { ...value, pos }]
				}),
			),
		})),
		groups: config.groups,
	}
}

export async function createComponentFile(
	config: StoryblokConfig,
	outPath: string,
): Promise<void> {
	return createFile(generateComponents(config), outPath)
}

export async function generatePresets(
	spaceID: number,
	personalToken: string,
	config: StoryblokConfig,
) {
	const apiComponents = await fetch(
		`https://mapi.storyblok.com/v1/spaces/${spaceID}/components`,
		{ headers: { Authorization: personalToken } },
	)
		.then(res => res.json())
		.catch(console.error)

	if (!('components' in apiComponents)) {
		throw new Error(
			'Could not fetch components. This could be because of the access token',
		)
	}

	const nameToId = Object.fromEntries(
		apiComponents.components.map((component: { name: string, id: number }) => [
			component.name,
			component.id,
		]),
	)

	return config.components
		.map((component) => {
			const componentId = nameToId[component.name]

			if (!componentId)
				console.error(`Component ${component.name} not found in the API`)

			return component.presets?.map(preset => ({
				...preset,
				component_id: componentId,
				preset: {
					...preset.preset,
					component: componentId.name,
				},
			}))
		})
		.flat()
		.filter(Boolean)
}

export async function createPresetsFile(
	spaceID: number,
	personalToken: string,
	config: StoryblokConfig,
	outPath: string,
): Promise<void> {
	return createFile(
		await generatePresets(spaceID, personalToken, config),
		outPath,
	)
}

export async function createFile(object: any, outPath: string): Promise<void> {
	try {
		const jsonData = JSON.stringify(object, null, 2)
		await fsPromises.writeFile(outPath, jsonData, 'utf8')
	} catch (error) {
		console.error('An error occurred while writing the file:', error)
	}
}
