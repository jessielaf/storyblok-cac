# StoryBlok Components as Code

Define StoryBlok components using the typesafety of TypeScript!

## Installation

```
npm install --save @jlaf/storyblok-cac
```

## Usage

First define your components:

```typescript
// src/components.ts
import { arrayToStoryBlokOptions, type StoryblokComponent } from "@jlaf/storyblok-cac";

export default [
  {
    name: "page",
    schema: {
      body: {
        type: "bloks",
      },
    },
    is_root: true,
    is_nestable: false,
  },
  {
    name: "content",
    schema: {
      content: {
        type: "richtext",
      },
      textAlign: {
        type: "option",
        options: arrayToStoryBlokOptions(["left", "center", "right"]),
        default_value: "left",
      },
    }
  },
] as StoryblokComponent[]
```

Now you can generate the components using:

```
yarn run storyblok-cac generate --input-file src/components.ts
```

This will output a `components.json` file which can be uploaded to Storyblok using the [Storyblok CLI](https://www.storyblok.com/tp/storyblok-cli-best-practices)

### CLI Parameters

| Parameter       | Default           | Description                    | Example               |
|-----------------|-------------------|--------------------------------|-----------------------|
| `--input-file`  | -                 | File containing the components | `src/components.ts`   |
| `--output-path` | `components.json` | Output of the json file        | `src/components.json` |

## Helpers

### `arrayToStoryBlokOptions`

This function creates an array which can be used by the Storyblok CLI. See usage above.

## Starter

The starter used is [antfu/starter-ts](https://github.com/antfu/starter-ts)