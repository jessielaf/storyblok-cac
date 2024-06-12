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
            const { tabId, ...restValues } = value
            key = `${key}-${tabId}`
            return [key, { pos, ...restValues }]
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
