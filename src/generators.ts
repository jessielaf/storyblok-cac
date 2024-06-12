import { promises as fsPromises } from "node:fs"
import type { StoryblokComponent } from "./types.js"

export function generateComponents(components: StoryblokComponent[]) {
  return {
    components: components.map(component => ({
      ...component,
      real_name: component.name,
      is_root: component.is_root ?? false,
      is_nestable: component.is_nestable ?? true,
      all_presets: component.all_presets ?? [],
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
  try {
    const jsonData = JSON.stringify(generateComponents(components), null, 2)
    await fsPromises.writeFile(outPath, jsonData, "utf8")
  }
  catch (error) {
    console.error("An error occurred while writing the file:", error)
  }
}
