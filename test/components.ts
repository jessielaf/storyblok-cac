import {
	type StoryblokComponent,
	type StoryblokConfig,
	arrayToStoryBlokOptions,
} from '../src/index.js'

export default {
	components: [
		{
			name: 'content',
			schema: {
				content: {
					type: 'richtext',
				},
				color: {
					type: 'option',
					source: 'internal',
					datasource_slug: 'colors',
				},
				textAlign: {
					type: 'option',
					options: arrayToStoryBlokOptions(['left', 'center', 'rightt']),
					default_value: 'left',
				},
				advanced: {
					type: 'tab',
					keys: ['content'],
					tabId: 'test',
				},
			},
			presets: [
				{
					name: 'colored',
					preset: {
						advanced: 'test',
					},
				},
			],
		},
		{
			name: 'test',
			schema: {},
			component_group_name: 'test',
		},
	] as StoryblokComponent[],
	groups: [
		{
			name: 'test',
		},
	],
} as StoryblokConfig
