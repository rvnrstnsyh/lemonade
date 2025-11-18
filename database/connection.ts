import * as schema from '@/database/schemas/index.ts'

import { Pool } from 'pg'
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'

const client: Pool = new Pool({
	connectionString: Deno.env.get('DB_URL'),
	host: Deno.env.get('DB_HOSTNAME'),
	port: Number(Deno.env.get('DB_PORT')),
	database: Deno.env.get('DB_NAME'),
	user: Deno.env.get('DB_USER'),
	password: Deno.env.get('DB_PASSWORD'),
	max: Number(Deno.env.get('DB_POOL_SIZE')),
	idleTimeoutMillis: Number(Deno.env.get('DB_TIMEOUT')),
})
const psql: PostgresJsDatabase<Record<string, unknown>> = drizzle({ client, schema, casing: 'snake_case' })

export default psql
