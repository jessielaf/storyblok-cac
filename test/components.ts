import { arrayToStoryBlokOptions, type StoryblokComponent } from "storyblok-cac"

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
      TextAlign: {
        type: "option",
        options: arrayToStoryBlokOptions(["left", "center", "right"]),
        default_value: "left",
      },
    },
  },
] as StoryblokComponent[]
