import { integer, PgTable, pgTable, varchar } from 'drizzle-orm/pg-core'

export const users: PgTable = pgTable('users', {
	id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull().unique(),
})
