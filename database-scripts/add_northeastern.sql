-- Script to add Northeastern University to the database

-- Check if the university already exists
INSERT INTO Universities (name, domain)
SELECT 'Northeastern University', 'northeastern.edu'
WHERE NOT EXISTS (
    SELECT 1 FROM Universities WHERE domain = 'northeastern.edu'
);

-- Confirm the insertion
SELECT * FROM Universities WHERE domain = 'northeastern.edu'; 