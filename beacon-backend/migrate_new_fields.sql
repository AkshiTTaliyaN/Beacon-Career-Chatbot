-- migrate_new_fields.sql
-- Run this ONCE against your beacon database to add the new columns.
-- Safe to run on an existing database — uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS.

-- Required if your PostgreSQL version < 9.6 does not support IF NOT EXISTS for types:
-- just run the CREATE TYPE blocks and skip ones that already exist.

-- ─── New enum types ────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE studyhoursenum AS ENUM ('lt1', '1to2', '2to4', 'gt4');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE coachingstatusenum AS ENUM ('self', 'school_tuition', 'coaching', 'online', 'mix');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE careerclarityenum AS ENUM ('clear', 'some_idea', 'exploring', 'no_idea');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE learningstylee AS ENUM ('visual', 'reading', 'practical', 'listening', 'mix');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── New columns on student_profiles ──────────────────────────────────────

ALTER TABLE student_profiles
  ADD COLUMN IF NOT EXISTS name               VARCHAR(80),
  ADD COLUMN IF NOT EXISTS enjoyed_subjects   JSON,
  ADD COLUMN IF NOT EXISTS study_hours        studyhoursenum,
  ADD COLUMN IF NOT EXISTS coaching_status    coachingstatusenum,
  ADD COLUMN IF NOT EXISTS career_clarity     careerclarityenum,
  ADD COLUMN IF NOT EXISTS learning_style     learningstylee,
  ADD COLUMN IF NOT EXISTS extracurricular    TEXT;

-- Verify
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'student_profiles'
ORDER BY ordinal_position;
