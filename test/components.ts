import {
  type StoryblokComponent,
  arrayToStoryBlokOptions,
} from "../src/index.js"

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
    presets: [
      {
        name: "colored",
        preset: {
          advanced: "test",
        },
      },
    ],
  },
] as StoryblokComponent[]
