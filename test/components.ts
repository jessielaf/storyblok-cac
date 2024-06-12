import {
  type StoryblokComponent,
  arrayToStoryBlokOptions,
} from "@jlaf/storyblok-cac"

export default [
  {
    name: "content",
    schema: {
      content: {
        type: "richtext",
      },
      color: {
        type: "option",
        source: "internal",
        datasource_slug: "colors",
      },
      textAlign: {
        type: "option",
        options: arrayToStoryBlokOptions(["left", "center", "right"]),
        default_value: "left",
      },
      advanced: {
        type: "tab",
        keys: ["content"],
        tabId: "test",
      },
    },
  },
] as StoryblokComponent[]
