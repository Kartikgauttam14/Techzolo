-- Added script to clear all data and reset database to empty state
-- Clear Database Script
-- This removes all data from tables while keeping the structure

DELETE FROM contact_submissions;
DELETE FROM user_projects;
DELETE FROM user_sessions;
DELETE FROM users;

-- Reset auto-increment counters
DELETE FROM sqlite_sequence WHERE name IN ('users', 'user_sessions', 'contact_submissions', 'user_projects');

-- Verify tables are empty
SELECT 'Users count: ' || COUNT(*) FROM users;
SELECT 'Contact submissions count: ' || COUNT(*) FROM contact_submissions;
SELECT 'User projects count: ' || COUNT(*) FROM user_projects;
SELECT 'User sessions count: ' || COUNT(*) FROM user_sessions;
