#! /usr/bin/env node

import yargs from "yargs/yargs"
import { hideBin } from "yargs/helpers"
import path from "path"
import { createComponentFile } from "./generators.js"
import { tsImport } from "tsx/esm/api"

const main = async () => {
  const argv = await yargs(hideBin(process.argv))
    .option("inputFile", {
      description: "The TypeScript file where the components are located.",
      type: "string",
      demandOption: true,
    })
    .option("outputFile", {
      alias: "o",
      default: "./components.json",
      description:
        "Output of the JSON file containing the StoryBlok components.",
      type: "string",
    })
    .help()
    .alias("help", "h").argv

  const inputFile = argv.inputFile

  try {
    const components = await tsImport(
      path.resolve(process.cwd(), inputFile),
      "/"
    )

    createComponentFile(components.default, argv.outputFile)
  } catch (error: any) {
    console.error("Error loading the TypeScript file:", error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

main()