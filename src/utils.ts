import { StoryblokOption } from "./types.js"

export const arrayToStoryBlokOptions = (array: string[]): StoryblokOption[] => {
  return array.map((value) => ({ name: value, value }))
}
