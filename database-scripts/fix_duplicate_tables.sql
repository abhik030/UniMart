-- First, backup any data from the lowercase table
INSERT INTO Universities (name, domain)
SELECT name, domain FROM universities
WHERE NOT EXISTS (
    SELECT 1 FROM Universities WHERE domain = universities.domain
);

-- Drop the lowercase table
DROP TABLE IF EXISTS universities;

-- Verify the data
SELECT * FROM Universities; 