-- migrate_scoring_fields.sql
-- Run this once on the Postgres instance after pulling the new code.
-- Adds the three scoring input columns to student_profiles.

ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS subject_ratings  JSONB;
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS work_style        JSONB;
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS career_priorities JSONB;
