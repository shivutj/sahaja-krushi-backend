-- Add escalatedAt column to queries table
ALTER TABLE `queries` ADD COLUMN `escalatedAt` DATETIME NULL AFTER `answer`;

-- Add index for better performance when filtering escalated queries
CREATE INDEX `idx_queries_escalated_at` ON `queries` (`escalatedAt`);
