# Assignment: Exploring JSONB in PostgreSQL and Its Use as a NoSQL Alternative to MongoDB

## 1. Introduction

PostgreSQL is a powerful relational database management system (RDBMS) that mainly works with tables, rows, columns, and relationships.

However, PostgreSQL also supports storing and processing semi-structured data using **JSONB**.

JSONB allows PostgreSQL to store JSON documents in a binary format. Because of this, PostgreSQL can support both:

- Structured relational data using tables and columns
- Semi-structured document-based data using JSONB

Therefore, PostgreSQL can provide some features that are commonly associated with NoSQL databases such as MongoDB.

---

## 2. What is JSON?

JSON stands for **JavaScript Object Notation**. It is a lightweight format used to represent structured and semi-structured data.

Example:

```json
{
  "name": "Lavanya",
  "email": "lavanya@example.com",
  "skills": ["Java", "Python", "React"]
}
```

JSON stores data using:

- Key-value pairs
- Objects
- Arrays
- Nested objects

JSON is commonly used in:

- REST APIs
- Web applications
- Configuration files
- Data exchange between frontend and backend
- Database applications

---

## 3. What is JSONB in PostgreSQL?

PostgreSQL provides two data types for storing JSON:

- `JSON`
- `JSONB`

### JSON

The `JSON` data type stores the JSON data as text while validating that it contains valid JSON.

### JSONB

The `JSONB` data type stores JSON data in a decomposed binary format.

JSONB provides several advantages:

- Faster processing of JSON data
- Efficient searching
- Support for indexing
- Easy access to nested data
- Powerful operators for querying JSON data

For applications that frequently search or process JSON data, **JSONB is generally more useful than JSON**.

---

## 4. Creating a Table Using JSONB

Consider a user management application.

We can store some fixed information in normal columns and additional flexible information in a JSONB column.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150),
    data JSONB
);
```

Here:

- `id` is the primary key.
- `name` stores the user's name.
- `email` stores the user's email.
- `data` stores flexible JSONB information.

This allows different users to have different additional attributes.

---

## 5. Inserting JSONB Data

JSON data can be inserted into a JSONB column.

```sql
INSERT INTO users (name, email, data)
VALUES (
    'Lavanya',
    'lavanya@example.com',
    '{
        "age": 20,
        "skills": ["Java", "Python", "React"],
        "address": {
            "city": "Dehradun",
            "state": "Uttarakhand"
        }
    }'
);
```

Another user can have different fields:

```sql
INSERT INTO users (name, email, data)
VALUES (
    'Rahul',
    'rahul@example.com',
    '{
        "age": 21,
        "skills": ["Java", "SQL"],
        "github": "rahul123"
    }'
);
```

In this example, the first user has an `address` field while the second user has a `github` field.

A new database column is not required for every additional attribute.

This flexibility is one of the similarities between PostgreSQL JSONB and document-oriented databases such as MongoDB.

## 6. Accessing Data Stored in JSONB

PostgreSQL provides operators that allow us to access individual values from a JSONB document.

### 6.1 `->` Operator

The `->` operator is used to access a JSON object or JSON value.

Example:

```sql
SELECT data->'skills'
FROM users;
```

Output:

```text
["Java", "Python", "React"]
```

If we want to access the nested `address` object:

```sql
SELECT data->'address'
FROM users;
```

Output:

```json
{
    "city": "Dehradun",
    "state": "Uttarakhand"
}
```

---

### 6.2 `->>` Operator

The `->>` operator extracts a JSON value as **text**.

Example:

```sql
SELECT data->>'age'
FROM users;
```

Output:

```text
20
```

Similarly:

```sql
SELECT data->'address'->>'city'
FROM users;
```

Output:

```text
Dehradun
```

The difference is:

| Operator | Returns |
|---|---|
| `->` | JSON/JSONB value |
| `->>` | Text value |

---

## 7. Accessing Nested JSONB Data

JSONB can contain objects inside other objects.

For example:

```json
{
    "name": "Lavanya",
    "address": {
        "city": "Dehradun",
        "state": "Uttarakhand"
    }
}
```

We can access the city using:

```sql
SELECT data->'address'->>'city'
FROM users;
```

Result:

```text
Dehradun
```

This makes it possible to work with complex and nested data without creating separate tables for every small piece of information.

---

## 8. Searching JSONB Data

PostgreSQL allows us to search for specific values inside JSONB documents.

For example, suppose we want to find users whose JSONB data contains the skill `Java`.

We can use the containment operator `@>`:

```sql
SELECT *
FROM users
WHERE data @> '{"skills": ["Java"]}';
```

The `@>` operator checks whether the JSONB document contains the specified JSON structure.

Another example:

```sql
SELECT *
FROM users
WHERE data @> '{"age": 20}';
```

This returns users whose JSONB data contains:

```json
{
    "age": 20
}
```

---

## 9. Updating JSONB Data

JSONB data can also be modified using PostgreSQL functions and operators.

For example, to add or update a field:

```sql
UPDATE users
SET data = jsonb_set(
    data,
    '{age}',
    '21'
)
WHERE name = 'Lavanya';
```

This changes the `age` value from `20` to `21`.

We can also add a new field:

```sql
UPDATE users
SET data = jsonb_set(
    data,
    '{github}',
    '"lavanyaag23"'
)
WHERE name = 'Lavanya';
```

The JSONB data will now contain:

```json
{
    "age": 21,
    "skills": ["Java", "Python", "React"],
    "github": "lavanyaag23"
}
```

---

## 10. JSONB Indexing

One of the important advantages of JSONB is that PostgreSQL supports indexing JSONB data.

An index can improve the performance of queries when a table contains a large amount of JSONB data.

A commonly used index is a **GIN (Generalized Inverted Index)**.

Example:

```sql
CREATE INDEX users_data_index
ON users
USING GIN (data);
```

After creating the index, queries involving JSONB containment can be performed more efficiently.

For example:

```sql
SELECT *
FROM users
WHERE data @> '{"skills": ["Java"]}';
```

This is particularly useful when the database contains thousands or millions of records.

---

## 11. Advantages of JSONB

The major advantages of JSONB include:

1. **Flexible structure**  
   Different records can contain different fields.

2. **Efficient querying**  
   PostgreSQL provides operators for searching JSONB data.

3. **Indexing support**  
   JSONB data can be indexed using GIN indexes.

4. **Nested data support**  
   Objects and arrays can be stored inside JSONB documents.

5. **Combination with relational data**  
   JSONB can be used along with normal SQL columns.

6. **No separate NoSQL database required**  
   Applications can store both structured and semi-structured data in PostgreSQL.

7. **Strong SQL capabilities**  
   PostgreSQL continues to provide joins, transactions, constraints, aggregation, and other relational database features.

   ## 12. How PostgreSQL Can Work as Both SQL and NoSQL Database

PostgreSQL is traditionally a relational SQL database. It stores data in tables with rows and columns.

However, the JSONB data type allows PostgreSQL to store document-like data.

Therefore, PostgreSQL can combine both approaches:

```text
                 PostgreSQL
                     |
          +----------+----------+
          |                     |
     Relational Data        JSONB Data
          |                     |
   Tables & Columns       Document-like Data
          |                     |
        SQL            NoSQL-like Operations
```

For example, a user table can contain fixed fields:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150),
    profile JSONB
);
```

The `name` and `email` fields have a fixed structure, while the `profile` column can contain flexible information.

Example:

```json
{
    "age": 20,
    "skills": ["Java", "Python", "React"],
    "projects": [
        "Todo App",
        "Mongoose Demo"
    ]
}
```

This approach provides the benefits of both relational and document-based databases.

---

## 13. PostgreSQL JSONB vs MongoDB

MongoDB is a NoSQL document-oriented database. It stores information as BSON documents.

PostgreSQL normally stores information in relational tables, but JSONB allows it to store document-like structures.

### Comparison

| Feature | PostgreSQL with JSONB | MongoDB |
|---|---|---|
| Database type | Relational + JSONB | NoSQL document database |
| Main structure | Tables and rows | Collections and documents |
| Flexible data | JSONB columns | Documents |
| SQL support | Yes | No traditional SQL |
| Relationships | Strong support using foreign keys and JOINs | Usually handled through embedding or references |
| Transactions | Strong ACID transaction support | Supports transactions |
| JSON-like data | JSON/JSONB | BSON |
| Indexing | B-tree, GIN and other indexes | Multiple index types |
| Schema | Can be structured, flexible, or hybrid | Flexible document schema |
| Best suited for | Applications needing SQL + flexible data | Applications primarily using document-based data |

---

## 14. Example: Same Data in PostgreSQL and MongoDB

Consider a student record.

### MongoDB Document

In MongoDB, the student could be stored as:

```json
{
    "name": "Lavanya",
    "email": "lavanya@example.com",
    "skills": [
        "Java",
        "Python",
        "React"
    ],
    "address": {
        "city": "Dehradun",
        "state": "Uttarakhand"
    }
}
```

The entire document can be stored inside a MongoDB collection.

### PostgreSQL JSONB

The same document can be stored in a JSONB column:

```sql
INSERT INTO students (name, data)
VALUES (
    'Lavanya',
    '{
        "email": "lavanya@example.com",
        "skills": ["Java", "Python", "React"],
        "address": {
            "city": "Dehradun",
            "state": "Uttarakhand"
        }
    }'
);
```

Here, PostgreSQL stores the flexible portion of the student information inside the JSONB column.

---

## 15. Advantages of Using PostgreSQL Instead of MongoDB

Using PostgreSQL with JSONB can be beneficial when an application needs both relational and flexible data.

### 15.1 One Database for Different Data Models

An application does not necessarily need separate databases for structured and semi-structured data.

For example:

```text
Users
  |
  +-- Fixed information → SQL columns
  |
  +-- Flexible information → JSONB
```

---

### 15.2 Powerful SQL Queries

PostgreSQL provides SQL features such as:

- `SELECT`
- `JOIN`
- `GROUP BY`
- `ORDER BY`
- Aggregate functions
- Subqueries
- Transactions

These features can be used together with JSONB.

---

### 15.3 Data Integrity

PostgreSQL provides features such as:

- Primary keys
- Foreign keys
- Unique constraints
- NOT NULL constraints
- CHECK constraints
- Transactions

These features help maintain data consistency.

---

### 15.4 Flexible Schema

JSONB allows additional fields to be stored without changing the table structure.

For example, one user may have:

```json
{
    "github": "lavanyaag23"
}
```

while another may have:

```json
{
    "linkedin": "user-profile",
    "github": "user123",
    "portfolio": "portfolio-site"
}
```

Both can be stored in the same JSONB column.

---

## 16. Limitations of Using PostgreSQL JSONB

Although JSONB provides NoSQL-like functionality, it does not mean PostgreSQL completely becomes MongoDB.

Some limitations are:

1. PostgreSQL is primarily a relational database.
2. JSONB data can become difficult to manage if the entire application is designed only around documents.
3. Complex JSONB queries can become harder to understand.
4. Poorly designed JSONB structures can affect performance.
5. MongoDB is specifically designed around document-oriented data.

Therefore, the choice between PostgreSQL and MongoDB depends on the application's requirements.

---

## 17. When Should PostgreSQL JSONB Be Used?

PostgreSQL JSONB is useful when:

- The application already uses PostgreSQL.
- Most data is relational but some fields are flexible.
- The application requires SQL queries and relationships.
- JSON data needs to be searched or indexed.
- The structure of some data changes frequently.
- Strong transactions and data integrity are important.

For example, an e-commerce application could store:

```text
Product
├── id
├── name
├── price
├── category
└── specifications (JSONB)
```

The common product information remains in normal columns, while different products can have different specifications inside JSONB.

---

## 18. When Should MongoDB Be Used?

MongoDB can be a better choice when:

- The application is primarily document-oriented.
- Data is naturally represented as documents.
- Flexible schemas are required throughout the application.
- The application works mainly with document-based operations.
- Relational joins and strict relational constraints are not the primary requirement.

For example, content management systems and applications with highly variable document structures can benefit from a document-oriented database.

---

## 19. Conclusion

PostgreSQL is not only a traditional SQL database. With its JSON and JSONB features, it can also handle semi-structured and document-like data.

JSONB provides:

- Flexible data storage
- JSON document support
- Nested objects and arrays
- JSON-specific querying
- Indexing
- Integration with normal SQL tables

This allows PostgreSQL to act as a **hybrid database**, combining relational SQL capabilities with NoSQL-like document storage.

However, PostgreSQL JSONB and MongoDB are not exactly the same. PostgreSQL is generally a better choice when an application requires strong relational features along with flexible JSON data, while MongoDB is specifically designed as a document-oriented NoSQL database.

Therefore, JSONB makes PostgreSQL a strong option for applications that need **both structured SQL data and flexible NoSQL-style data in a single database system**.
# 20. Practical Example: Student Management System

Consider a student management application.

Some information about every student is fixed, such as:

- Student ID
- Name
- Email
- Semester

Other information may be different for every student, such as:

- Skills
- Certifications
- Projects
- Social media profiles
- Preferences

PostgreSQL can store the fixed information in normal columns and flexible information in a JSONB column.

### Table Creation

```sql
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    semester INT,
    details JSONB
);
```

### Insert Data

```sql
INSERT INTO students (name, email, semester, details)
VALUES (
    'Lavanya',
    'lavanya@example.com',
    5,
    '{
        "skills": ["Java", "Python", "React"],
        "projects": ["Todo App", "Mongoose Demo"],
        "address": {
            "city": "Dehradun",
            "state": "Uttarakhand"
        }
    }'
);
```

### Retrieve the Complete Record

```sql
SELECT * FROM students;
```

### Retrieve Skills

```sql
SELECT details->'skills'
FROM students;
```

### Retrieve City

```sql
SELECT details->'address'->>'city'
FROM students;
```

### Search Students by Skill

```sql
SELECT *
FROM students
WHERE details @> '{"skills": ["Java"]}';
```

This example demonstrates how PostgreSQL can combine traditional relational columns with flexible JSONB data.

---

# 21. SQL and NoSQL Features Together

PostgreSQL allows an application to use both approaches in the same database.

### Traditional SQL Data

```sql
SELECT name, email, semester
FROM students
WHERE semester = 5;
```

The above query works with structured relational data.

### NoSQL-Style JSONB Data

```sql
SELECT name
FROM students
WHERE details @> '{"skills": ["Java"]}';
```

The above query searches inside a JSONB document.

Therefore, the same PostgreSQL database can handle:

```text
Structured Data
      +
Semi-Structured Data
      |
      ↓
  PostgreSQL
```

---

# 22. JSON vs JSONB

PostgreSQL provides both `JSON` and `JSONB` data types.

| Feature | JSON | JSONB |
|---|---|---|
| Storage | Stores original JSON text | Stores binary representation |
| Processing | Parsed when processed | Parsed during input |
| Querying | Supported | Supported |
| Indexing | Limited | Strong indexing support |
| Performance for querying | Generally slower | Generally faster |
| Recommended for frequent querying | No | Yes |

For most applications that need to search and manipulate JSON data, **JSONB is generally preferred**.

---

# 23. Real-World Applications

PostgreSQL JSONB can be useful in many types of applications.

### E-Commerce

```text
Product
├── Product ID
├── Name
├── Price
├── Category
└── Specifications (JSONB)
```

Different products can have different specifications.

For example, a laptop may have:

```json
{
    "ram": "8GB",
    "storage": "512GB SSD",
    "processor": "Intel i5"
}
```

A mobile phone may have:

```json
{
    "ram": "8GB",
    "storage": "256GB",
    "camera": "50MP"
}
```

Both can be stored in the same JSONB column.

### User Profiles

A user table can store common information in relational columns while keeping optional profile information in JSONB.

### Content Management Systems

Articles, posts, and metadata can contain different fields depending on the content type.

### IoT Applications

Sensor data can contain different attributes depending on the type of device.

---

# 24. Benefits of the Hybrid Approach

Using PostgreSQL with JSONB provides a hybrid database model.

### Main Benefits

1. **Flexibility**  
   JSONB allows changing or optional fields.

2. **Relational structure**  
   Important information can remain in strongly structured tables.

3. **SQL support**  
   Developers can continue using SQL.

4. **Relationships**  
   Tables can be connected using foreign keys and joins.

5. **Transactions**  
   PostgreSQL provides transactional support.

6. **JSON querying**  
   Data inside JSONB can be searched and manipulated.

7. **Indexing**  
   JSONB data can be indexed for better query performance.

8. **Single database**  
   Applications may not need a separate NoSQL database for moderately flexible document data.

---

# 25. PostgreSQL JSONB vs MongoDB: Final View

PostgreSQL JSONB and MongoDB solve similar problems in some situations, but their design philosophies are different.

```text
PostgreSQL
    |
    +-- Relational tables
    |
    +-- SQL
    |
    +-- JOINs
    |
    +-- Transactions
    |
    +-- JSONB
            |
            +-- Flexible documents
            +-- Nested objects
            +-- Arrays
            +-- JSON queries
```

MongoDB, on the other hand, is designed primarily around documents.

Therefore:

- Use **PostgreSQL + JSONB** when relational data is important and only some data needs flexibility.
- Use **MongoDB** when the application is primarily document-oriented and most data naturally fits the document model.

---

# 26. Key Takeaways

The important points from this assignment are:

- PostgreSQL is a relational SQL database.
- PostgreSQL supports `JSON` and `JSONB`.
- JSONB stores JSON-like document data efficiently.
- JSONB supports nested objects and arrays.
- Operators such as `->` and `->>` can access JSONB values.
- The `@>` operator can be used for JSONB containment searches.
- JSONB data can be indexed using GIN indexes.
- PostgreSQL can store structured and semi-structured data together.
- This makes PostgreSQL capable of providing **SQL and NoSQL-style functionality**.
- PostgreSQL JSONB is not a complete replacement for every MongoDB use case.
- The appropriate database depends on the application's data model and requirements.

---

# 27. Final Conclusion

PostgreSQL's JSONB feature extends the capabilities of a traditional relational database by allowing it to store and process flexible, document-like data.

Instead of maintaining separate SQL and NoSQL databases, an application can use normal PostgreSQL tables for structured information and JSONB columns for data whose structure may change.

This hybrid approach combines the advantages of relational databases, such as SQL queries, relationships, transactions, and data integrity, with the flexibility of NoSQL-style document storage.

Hence, PostgreSQL can effectively work as both an **SQL database and a NoSQL-capable database**, especially for applications where structured and flexible data need to coexist.

However, PostgreSQL JSONB should not be considered an exact replacement for MongoDB. The choice should be based on the application's requirements, data structure, scalability needs, and the type of queries being performed.

# 28. Summary

PostgreSQL provides a powerful combination of relational and document-based data storage.

The traditional relational model is useful for structured data, relationships, constraints, and SQL queries. JSONB extends PostgreSQL by allowing flexible and semi-structured information to be stored inside a column.

Using JSONB, PostgreSQL can perform operations commonly associated with NoSQL databases, such as storing nested objects, arrays, and dynamically structured data.

Therefore, PostgreSQL can be used as a **hybrid database system**, combining SQL and NoSQL-style capabilities.

---

# 29. Important SQL Commands

The following commands demonstrate the basic use of JSONB in PostgreSQL.

### Create a Table

```sql
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    details JSONB
);
```

### Insert JSONB Data

```sql
INSERT INTO students (name, details)
VALUES (
    'Lavanya',
    '{
        "age": 20,
        "skills": ["Java", "Python"],
        "city": "Dehradun"
    }'
);
```

### Display Data

```sql
SELECT * FROM students;
```

### Access a JSONB Object

```sql
SELECT details->'skills'
FROM students;
```

### Access a Text Value

```sql
SELECT details->>'city'
FROM students;
```

### Search JSONB Data

```sql
SELECT *
FROM students
WHERE details @> '{"city": "Dehradun"}';
```

### Create a JSONB Index

```sql
CREATE INDEX students_details_idx
ON students
USING GIN (details);
```

---
