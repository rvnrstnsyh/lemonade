import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	out: '_drizzle',
	schema: 'database/schemas/**/*.schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: String(Deno.env.get('DB_URL')),
	},
})
