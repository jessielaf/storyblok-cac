import type { StoryblokOption } from "./types.js"

export function arrayToStoryBlokOptions(array: string[]): StoryblokOption[] {
  return array.map(value => ({ name: value, value }))
}
