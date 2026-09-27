-- ============================================================
-- Assignment 2
-- PostgreSQL as SQL + NoSQL using JSONB
-- Student: Lavanya Agrawal
-- ============================================================


-- ============================================================
-- TASK 1: Create Database and Products Table
-- ============================================================

-- Run this separately in PostgreSQL if required:
-- CREATE DATABASE assignment2;

-- Connect to assignment2 before running the remaining queries.


DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    attributes JSONB
);


-- ============================================================
-- TASK 2: Insert Products
-- ============================================================

INSERT INTO products (name, category, price, attributes)
VALUES
(
    'Clean Code',
    'book',
    499.00,
    '{"author": "Robert C. Martin", "pages": 464}'
),
(
    'ThinkPad Laptop',
    'laptop',
    75000.00,
    '{"ram_gb": 16, "storage_gb": 512, "processor": "Intel i5", "wireless": true}'
),
(
    'Wireless Mouse',
    'accessory',
    899.00,
    '{"wireless": true, "dpi": 1600, "battery": "AA"}'
),
(
    'Mechanical Keyboard',
    'accessory',
    2499.00,
    '{"wireless": false, "switch": "Red", "backlight": true}'
),
(
    'Java Programming',
    'book',
    699.00,
    '{"author": "Herbert Schildt", "pages": 720, "edition": 12}'
);


-- Display all products

SELECT * FROM products;


-- ============================================================
-- TASK 3: JSONB Queries
-- ============================================================

-- 1. -> operator
-- Returns a JSON value.

SELECT
    name,
    attributes -> 'author' AS author
FROM products
WHERE category = 'book';


-- 2. ->> operator
-- Returns the JSON value as TEXT.

SELECT
    name,
    attributes ->> 'author' AS author
FROM products
WHERE category = 'book';


-- Difference:
-- ->  returns JSON/JSONB
-- ->> returns text


-- 3. @> operator
-- Checks whether JSONB contains the given JSON structure.

SELECT name
FROM products
WHERE attributes @> '{"wireless": true}';


-- 4. ? operator
-- Checks whether a key exists.

SELECT name
FROM products
WHERE attributes ? 'wireless';


-- 5. Extract a numeric JSONB value and compare it

SELECT name, attributes ->> 'ram_gb' AS ram
FROM products
WHERE attributes ? 'ram';


-- Laptops having RAM greater than or equal to 16 GB

SELECT name, attributes ->> 'ram_gb' AS ram
FROM products
WHERE category = 'laptop'
  AND (attributes ->> 'ram_gb')::INTEGER >= 16;


-- ============================================================
-- TASK 4: PostgreSQL as SQL + NoSQL
-- ============================================================

-- PostgreSQL can store normal structured columns:

SELECT
    id,
    name,
    category,
    price
FROM products;


-- At the same time, it can store flexible document-style
-- information inside the JSONB column:

SELECT
    name,
    attributes
FROM products;


-- Query structured data + JSONB data together

SELECT
    name,
    category,
    price,
    attributes ->> 'processor' AS processor
FROM products
WHERE category = 'laptop';


-- ============================================================
-- TASK 5: More JSONB Operations
-- ============================================================

-- Get a JSONB value as text

SELECT
    name,
    attributes ->> 'pages' AS pages
FROM products
WHERE attributes ? 'pages';


-- Check for a specific JSONB value

SELECT name
FROM products
WHERE attributes @> '{"wireless": true}';


-- Check whether the JSONB object contains a particular key

SELECT name
FROM products
WHERE attributes ? 'author';


-- Update a JSONB value

UPDATE products
SET attributes = jsonb_set(
    attributes,
    '{ram_gb}',
    '32'
)
WHERE name = 'ThinkPad Laptop';


-- Verify update

SELECT name, attributes
FROM products
WHERE name = 'ThinkPad Laptop';


-- ============================================================
-- TASK 6: GIN INDEX AND PERFORMANCE
-- ============================================================

-- Create a GIN index on the JSONB column

CREATE INDEX idx_products_attributes
ON products
USING GIN (attributes);


-- Query that can benefit from the GIN index

EXPLAIN ANALYZE
SELECT name
FROM products
WHERE attributes @> '{"wireless": true}';


-- Another JSONB containment query

EXPLAIN ANALYZE
SELECT name
FROM products
WHERE attributes @> '{"wireless": true, "backlight": true}';


-- A query based only on the normal price column is not what
-- this JSONB GIN index is designed for.

EXPLAIN ANALYZE
SELECT name
FROM products
WHERE price > 1000;


-- ============================================================
-- TASK 7: SQL + NoSQL Comparison
-- ============================================================

-- Structured SQL data

SELECT
    id,
    name,
    category,
    price
FROM products;


-- Document-style JSONB data

SELECT
    id,
    name,
    attributes
FROM products;


-- Both can be queried in the same PostgreSQL database.

SELECT
    name,
    price,
    attributes ->> 'wireless' AS wireless
FROM products;


-- ============================================================
-- END OF ASSIGNMENT
-- ============================================================