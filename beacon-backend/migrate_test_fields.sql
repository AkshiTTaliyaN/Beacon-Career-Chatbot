-- migrate_test_fields.sql
-- Run this once on the Postgres instance to add the new test fields.

ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS hobbies JSONB;
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS aptitude_scores JSONB;
