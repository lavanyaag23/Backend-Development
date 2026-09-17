-- Student Management System

-- Create students table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    branch VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    enrollment_date DATE NOT NULL
);

-- Insert 5 student records
INSERT INTO students (name, branch, email, enrollment_date)
VALUES
('Lavanya Agrawal', 'CSE', 'lavanya@example.com', '2024-01-15'),
('Rahul Sharma', 'ECE', 'rahul@example.com', '2024-02-10'),
('Ananya Singh', 'CSE', 'ananya@example.com', '2023-12-20'),
('Rohan Verma', 'ME', 'rohan@example.com', '2024-03-05'),
('Priya Gupta', 'CSE', 'priya@example.com', '2024-06-18');

-- Display all students
SELECT * FROM students;

-- 1. Retrieve all students in CSE branch
SELECT *
FROM students
WHERE branch = 'CSE';

-- 2. Find students enrolled after January 2024
SELECT *
FROM students
WHERE enrollment_date > '2024-01-31';

-- 3. Update a student's branch
UPDATE students
SET branch = 'CSE'
WHERE name = 'Rahul Sharma';

-- Verify update
SELECT *
FROM students
WHERE name = 'Rahul Sharma';

-- 4. Delete a student record
DELETE FROM students
WHERE name = 'Rohan Verma';

-- Display final records
SELECT * FROM students;