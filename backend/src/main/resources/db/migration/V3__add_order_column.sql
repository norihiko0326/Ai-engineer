ALTER TABLE tasks ADD COLUMN "order" INTEGER DEFAULT 0;
CREATE INDEX idx_tasks_status_order ON tasks(status, "order");
