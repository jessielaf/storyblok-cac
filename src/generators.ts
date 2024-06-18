import { promises as fsPromises } from "node:fs"
import type { StoryblokComponent } from "./types.js"

export function generateComponents(components: StoryblokComponent[]) {
  return {
    components: components.map(({ presets, ...component }) => ({
      ...component,
      real_name: component.name,
      is_root: component.is_root ?? false,
      is_nestable: component.is_nestable ?? true,
      all_presets: presets?.map(preset => ({
        name: preset.name,
      })) ?? [],
      schema: Object.fromEntries(
        Object.entries(component.schema).map(([key, value], index) => {
          const pos = index + 1

          if (value.type === "tab") {
            // Tabs have ids in them inserted. We force this by creating the tabId
            const { tabId, ...restValues } = value
            key = `${key}-${tabId}`
            return [key, { pos, ...restValues }]
          }
          else if (value.type === "bloks") {
            // If a component whitelist is provided, we need to add the restrict_components property
            if (value.component_whitelist && value.component_whitelist.length) {
              ;(value as any).restrict_components = true
            }
          }

          return [key, { ...value, pos }]
        }),
      ),
    })),
  }
}

export async function createComponentFile(
  components: StoryblokComponent[],
  outPath: string,
): Promise<void> {
  return createFile(generateComponents(components), outPath)
}

export async function generatePresets(spaceID: number, personalToken: string, components: StoryblokComponent[]) {
  const apiComponents = await fetch(`https://mapi.storyblok.com/v1/spaces/${spaceID}/components`, {
    headers: {
      Authorization: personalToken,
    },
  }).then(res => res.json())

  const nameToId = Object.fromEntries(apiComponents.components.map((component: { name: string, id: number }) => [component.name, component.id]))

  return components.map((component) => {
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
  }).flat()
}

export async function createPresetsFile(
  spaceID: number,
  personalToken: string,
  components: StoryblokComponent[],
  outPath: string,
): Promise<void> {
  return createFile(await generatePresets(spaceID, personalToken, components), outPath)
}

export async function createFile(
  object: any,
  outPath: string,
): Promise<void> {
  try {
    const jsonData = JSON.stringify(object, null, 2)
    await fsPromises.writeFile(outPath, jsonData, "utf8")
  }
  catch (error) {
    console.error("An error occurred while writing the file:", error)
  }
}
