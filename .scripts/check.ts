// deno-lint-ignore-file no-console

const NODE_MODULES_DIR: string = 'node_modules'

/**
 * @description Checks if the current platform is Windows.
 * @returns {boolean} True if the platform is Windows.
 */
function isWindows(): boolean {
	return Deno.build.os === 'windows'
}

/**
 * @description Deletes the "node_modules" directory if it exists. Logs the deletion process.
 * Handles errors such as the directory not being found or not empty on Windows.
 * @returns {Promise<void>} Resolves when deletion is attempted or skipped.
 */
async function removeNodeModules(): Promise<void> {
	try {
		const stat: Deno.FileInfo = await Deno.stat(NODE_MODULES_DIR)
		if (stat.isDirectory) {
			console.log(`Removing "${NODE_MODULES_DIR}"...`)
			try {
				await Deno.remove(NODE_MODULES_DIR, { recursive: true })
				console.log(`"${NODE_MODULES_DIR}" has been removed.`)
			} catch (error) {
				// Windows-specific handling for "directory not empty" error.
				if (isWindows() && error instanceof Error && error.message.includes('directory is not empty')) {
					console.warn(`Windows: Could not remove "${NODE_MODULES_DIR}" directory using standard method.`)
					console.warn(`Continuing with checks anyway...`)
				} else {
					console.error('Error removing node_modules, continuing anyway:', error instanceof Error ? error.message : error)
				}
			}
		}
	} catch (error: unknown) {
		if (error instanceof Deno.errors.NotFound) {
			console.warn(`"${NODE_MODULES_DIR}" does not exist. Skipping deletion.`)
		} else {
			console.error('Error checking node_modules directory, continuing anyway:', error instanceof Error ? error.message : error)
		}
	}
}

/**
 * @description Runs a command and captures its output.
 */
async function runCommand(cmd: string[]): Promise<boolean> {
	const command: Deno.Command = new Deno.Command(cmd[0], {
		args: cmd.slice(1),
		stdout: 'inherit',
		stderr: 'inherit',
	})
	const { code }: { code: number } = await command.output()

	return code === 0
}

/**
 * @description Main execution flow: removes node_modules, then runs checks.
 */
async function main(): Promise<void> {
	await removeNodeModules()

	if (!(await runCommand(['deno', 'fmt', '--check']))) {
		console.error('Formatting check failed.')
		Deno.exit(1)
	}

	if (!(await runCommand(['deno', 'lint']))) {
		console.error('Linting failed.')
		Deno.exit(1)
	}

	if (!(await runCommand(['deno', 'check', '**/*.ts', '**/.*/**/*.ts', '**/*.tsx', '**/.*/**/*.tsx', '.scripts/**/*.ts']))) {
		console.error('Type checking failed.')
		Deno.exit(1)
	}

	console.log('All checks passed.')
}

await main()
