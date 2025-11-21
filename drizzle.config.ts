import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	out: '_drizzle',
	schema: 'databases/postgresql/schemas/**/*.schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: String(Deno.env.get('DB_URL')),
	},
})
