import { promises as fsPromises } from "fs"
import type { StoryblokComponent } from "./types.js"

export const generateComponents = (components: StoryblokComponent[]) => ({
  components: components.map((component) => ({
    ...component,
    real_name: component.name,
    is_root: component.is_root ?? false,
    is_nestable: component.is_nestable ?? true,
    all_presets: component.all_presets ?? [],
    schema: Object.fromEntries(
      Object.entries(component.schema).map(([key, value], index) => [
        key,
        {
          ...value,
          pos: index + 1,
        },
      ])
    ),
  })),
})

export async function createComponentFile(
  components: StoryblokComponent[],
  outPath: string
): Promise<void> {
  try {
    const jsonData = JSON.stringify(generateComponents(components), null, 2)
    await fsPromises.writeFile(outPath, jsonData, "utf8")
  } catch (error) {
    console.error("An error occurred while writing the file:", error)
  }
}