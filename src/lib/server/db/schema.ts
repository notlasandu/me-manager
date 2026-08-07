import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  priority: text('priority').notNull().default('medium'),
  status: text('status').notNull().default('todo'),
  deadline: text('deadline')
});

export const ui_versions = sqliteTable('ui_versions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  timestamp: integer('timestamp').notNull(),
  svelte_code: text('svelte_code').notNull(),
  json_config: text('json_config'),
  is_stable: integer('is_stable', { mode: 'boolean' }).notNull().default(true)
});
