import * as drizzle from 'drizzle-orm/pg-core'

export const users: drizzle.PgTable = drizzle.pgTable('users', {
	id: drizzle.integer('id').generatedAlwaysAsIdentity(),
	name: drizzle.varchar('name', { length: 255 }).notNull(),
	email: drizzle.varchar('email', { length: 255 }).notNull().unique(),
}, (table): Array<drizzle.PrimaryKeyBuilder> => [
	drizzle.primaryKey({ name: 'pk_users', columns: [table.id] }),
	drizzle.unique('uq_users_email').on(table.email),
]) as drizzle.PgTable
