export interface StoryblokPreset {
	name: string
	preset: Record<string, any>
}

export interface StoryblokComponent {
	name: string
	schema: StoryblokSchema
	is_root?: boolean // defaults to false
	is_nestable?: boolean // defaults to true
	real_name?: string // defaults to name
	display_name?: string
	image?: string
	preview_field?: string
	preview_tmpl?: string
	preset_id?: string
	component_group_uuid?: string
	color?: string
	icon?: string
	presets?: StoryblokPreset[]
}

export interface StoryblokSchema {
	[key: string]:
		| StoryblokField
		| StoryblokSectionField
		| StoryblokOptionField
		| StoryblokAssetField
		| StoryblokNumberField
		| StoryblokDataSourceField
		| StoryblokTab
		| StoryblokBlokField
}

export interface StoryblokBaseField {
	key?: string
	translatable?: boolean
	description?: string
	required?: boolean
	default_value?: string | number | boolean
}

export interface StoryblokField extends StoryblokBaseField {
	type: 'text' | 'textarea' | 'richtext' | 'boolean'
}

export interface StoryblokBlokField extends StoryblokBaseField {
	type: 'bloks'
	component_whitelist?: string[]
}

export interface StoryblokNumberField extends StoryblokBaseField {
	type: 'number'
	min?: number
	max?: number
}

export interface StoryblokSectionField extends StoryblokBaseField {
	type: 'section'
	keys: string[]
}

export interface StoryblokOptionField extends StoryblokBaseField {
	type: 'option' | 'options'
	options: StoryblokOption[]
}

export interface StoryblokDataSourceField extends StoryblokBaseField {
	type: 'option' | 'options'
	source: 'internal'
	datasource_slug: string
}

export interface StoryblokAssetField extends StoryblokBaseField {
	type: 'asset' | 'multiasset'
	filetypes: ('images' | 'videos' | 'audio' | 'files' | 'all')[] // Did not check all types yet
}

export interface StoryblokOption {
	name: string
	value: string
}

export interface StoryblokTab {
	tabId: string
	display_name?: string
	type: 'tab'
	keys: string[]
}
