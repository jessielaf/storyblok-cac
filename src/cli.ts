#! /usr/bin/env node

import path from 'node:path'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { tsImport } from 'tsx/esm/api'
import { createComponentFile, createPresetsFile } from './generators.js'

async function getComponents(inputFile: string) {
	return (await tsImport(
		path.resolve(process.cwd(), inputFile),
		'/',
	)).default
}

async function main() {
	await yargs(hideBin(process.argv))
		.command(
			'components',
			'Generates a JSON file with the Storyblok components',
			(yargs) => {
				yargs.option('inputFile', {
					description: 'The TypeScript file where the components are located.',
					type: 'string',
					demandOption: true,
				})
					.option('outputFile', {
						alias: 'o',
						default: './components.json',
						description:
          'Output of the JSON file containing the StoryBlok components.',
						type: 'string',
					})
			},
			async (argv) => {
				const inputFile = argv.inputFile as string
				try {
					createComponentFile(await getComponents(inputFile), argv.outputFile as string)
				}
				catch (error: any) {
					console.error('Error loading the TypeScript file:', error.message)
					console.error(error.stack)
					process.exit(1)
				}
			},
		)
		.command(
			'presets',
			'Generates a JSON file with the Storyblok presets',
			(yargs) => {
				yargs
					.option('inputFile', {
						description: 'The TypeScript file where the presets are located.',
						type: 'string',
						demandOption: true,
					})
					.option('space-id', {
						description: 'Storyblok space ID',
						type: 'number',
						demandOption: true,
					})
					.option('token', {
						description: 'Personal access token for storyblok. See https://www.storyblok.com/docs/api/management/getting-started/authentication',
						type: 'string',
						demandOption: true,
					})
					.option('outputFile', {
						alias: 'o',
						default: './presets.json',
						description:
          'Output of the JSON file containing the StoryBlok presets.',
						type: 'string',
					})
			},
			async (argv) => {
				const inputFile = argv.inputFile as string
				createPresetsFile(argv.spaceId as number, argv.token as string, await getComponents(inputFile), argv.outputFile as string)
			},
		)
		.demand(1, 'must provide a valid command')
		.help()
		.alias('help', 'h').argv
}

main()
