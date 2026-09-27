# Assignment 2 — PostgreSQL as SQL + NoSQL: Working with JSONB

**Student:** Lavanya Agrawal  
**Roll No.:** 590014327

---

## Aim

To explore PostgreSQL's `JSONB` data type and understand how PostgreSQL can work as both a traditional SQL database and a document-style NoSQL database.

The assignment also compares PostgreSQL with MongoDB and evaluates situations where PostgreSQL with JSONB can be used instead of MongoDB.

---

# 1. Introduction

PostgreSQL is a relational database management system that mainly stores data in tables with rows and columns.

However, PostgreSQL also provides support for semi-structured data through the `JSON` and `JSONB` data types.

`JSONB` allows PostgreSQL to store JSON documents inside a relational table.

Therefore, a PostgreSQL table can contain:

- Traditional structured columns
- Flexible JSONB columns
- SQL relationships and constraints
- JSON document-style data

This makes PostgreSQL capable of supporting both SQL and some NoSQL-style use cases.

---

# 2. What is JSONB?

`JSONB` stands for **JSON Binary**.

It stores JSON data in a decomposed binary format instead of storing the original JSON text exactly as entered.

For example:

```json
{
    "ram_gb": 16,
    "storage_gb": 512,
    "wireless": true
}
```

This information can be stored inside a PostgreSQL `JSONB` column.

Example:

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    category VARCHAR(50),
    price NUMERIC(10,2),
    attributes JSONB
);
```

Here, `name`, `category`, and `price` are structured relational columns, while `attributes` can contain flexible document-style information.

---

# 3. JSON vs JSONB

PostgreSQL provides both `JSON` and `JSONB`.

| Feature | JSON | JSONB |
|---|---|---|
| Storage | Text representation | Binary/decomposed representation |
| Input format preserved | Yes | No |
| Query performance | Generally slower | Generally faster |
| Indexing | Limited | Strong indexing support |
| Duplicate object keys | Preserved in input | Duplicate keys are not preserved |
| Recommended for frequent querying | Usually not | Yes |

For applications that frequently query JSON data, `JSONB` is generally more useful because PostgreSQL can index the stored document.

---

# 4. PostgreSQL as SQL + NoSQL

PostgreSQL can combine relational and document-style data in the same table.

For example:

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    attributes JSONB
);
```

The following fields are strongly structured:

```text
id
name
category
price
```

The `attributes` field is flexible:

```json
{
    "ram_gb": 16,
    "storage_gb": 512,
    "processor": "Intel i5",
    "wireless": true
}
```

Different products can have different attributes.

For example, a book may have:

```json
{
    "author": "Robert C. Martin",
    "pages": 464
}
```

while a laptop may have:

```json
{
    "ram_gb": 16,
    "storage_gb": 512,
    "processor": "Intel i5"
}
```

This provides document-style flexibility without giving up PostgreSQL's relational features.

---

# 5. JSONB Operators

PostgreSQL provides several operators for querying JSONB data.

## 5.1 `->` Operator

The `->` operator extracts a JSON/JSONB value.

Example:

```sql
SELECT
    name,
    attributes -> 'author' AS author
FROM products
WHERE category = 'book';
```

The result remains a JSON value.

---

## 5.2 `->>` Operator

The `->>` operator extracts a JSON value as text.

Example:

```sql
SELECT
    name,
    attributes ->> 'author' AS author
FROM products
WHERE category = 'book';
```

The result is returned as text.

### Difference

```text
->   returns JSON/JSONB
->>  returns text
```

---

## 5.3 `@>` Operator

The `@>` operator checks whether a JSONB document contains another JSONB document.

Example:

```sql
SELECT name
FROM products
WHERE attributes @> '{"wireless": true}';
```

This finds products whose attributes contain:

```json
{
    "wireless": true
}
```

---

## 5.4 `?` Operator

The `?` operator checks whether a key exists.

Example:

```sql
SELECT name
FROM products
WHERE attributes ? 'wireless';
```

This returns products that contain the `wireless` key.

---

# 6. Example Product Data

Five products were used for the experiment.

| Product | Category | Price | JSONB Attributes |
|---|---|---:|---|
| Clean Code | book | 499 | author, pages |
| ThinkPad Laptop | laptop | 75000 | RAM, storage, processor, wireless |
| Wireless Mouse | accessory | 899 | wireless, DPI, battery |
| Mechanical Keyboard | accessory | 2499 | wireless, switch, backlight |
| Java Programming | book | 699 | author, pages, edition |

Example:

```json
{
    "name": "ThinkPad Laptop",
    "category": "laptop",
    "price": 75000,
    "attributes": {
        "ram_gb": 16,
        "storage_gb": 512,
        "processor": "Intel i5",
        "wireless": true
    }
}
```

---

# 7. Querying JSONB Data

## Find wireless products

```sql
SELECT name
FROM products
WHERE attributes @> '{"wireless": true}';
```

This returns products where the `wireless` attribute is `true`.

---

## Find products having an author

```sql
SELECT name
FROM products
WHERE attributes ? 'author';
```

---

## Find laptops having at least 16 GB RAM

```sql
SELECT name, attributes ->> 'ram_gb' AS ram
FROM products
WHERE category = 'laptop'
AND (attributes ->> 'ram_gb')::INTEGER >= 16;
```

Here, the JSON value is converted from text into an integer before comparison.

---

# 8. GIN Index on JSONB

A GIN index can be created on a JSONB column.

```sql
CREATE INDEX idx_products_attributes
ON products
USING GIN (attributes);
```

GIN stands for **Generalized Inverted Index**.

It is useful for searching inside JSONB documents, especially for containment queries.

Example:

```sql
SELECT name
FROM products
WHERE attributes @> '{"wireless": true}';
```

With a suitable GIN index, PostgreSQL can perform this type of JSONB search more efficiently, especially when the table contains many rows.

---

# 9. EXPLAIN ANALYZE

`EXPLAIN ANALYZE` can be used to examine query execution.

Example:

```sql
EXPLAIN ANALYZE
SELECT name
FROM products
WHERE attributes @> '{"wireless": true}';
```

It provides information about how PostgreSQL executed the query and can help compare query performance before and after adding an index.

The GIN index is specifically useful for JSONB searches such as containment queries.

It does not replace indexes designed for unrelated columns.

For example:

```sql
SELECT name
FROM products
WHERE price > 1000;
```

is a query on the normal `price` column and would benefit from an appropriate index on `price`, rather than the JSONB GIN index.

---

# 10. PostgreSQL JSONB vs MongoDB

MongoDB is a NoSQL document database.

A MongoDB product document can look like:

```javascript
{
    name: "Clean Code",
    category: "book",
    price: 499,
    attributes: {
        author: "Robert C. Martin",
        pages: 464
    }
}
```

A similar document can be stored inside PostgreSQL using JSONB.

PostgreSQL:

```sql
INSERT INTO products
(name, category, price, attributes)
VALUES
(
    'Clean Code',
    'book',
    499,
    '{"author": "Robert C. Martin", "pages": 464}'
);
```

---

# 11. Query Comparison

## PostgreSQL JSONB

```sql
SELECT name
FROM products
WHERE attributes @> '{"wireless": true}';
```

## MongoDB

```javascript
db.products.find({
    "attributes.wireless": true
});
```

Both queries search for products where the `wireless` attribute is `true`.

---

# 12. MongoDB Query Using Mongoose

The MongoDB equivalent used in `assignment.js` is:

```javascript
const wirelessProducts = await Product.find({
    "attributes.wireless": true
});
```

For RAM:

```javascript
const laptops = await Product.find({
    category: "laptop",
    "attributes.ram_gb": {
        $gte: 16
    }
});
```

To check whether a field exists:

```javascript
const productsWithAuthor = await Product.find({
    "attributes.author": {
        $exists: true
    }
});
```

---

# 13. Advantages of PostgreSQL + JSONB

PostgreSQL with JSONB provides several advantages.

### 1. Relational and document data together

Structured data and flexible data can be stored in the same database.

### 2. Transactions

PostgreSQL provides strong transaction support.

This is useful when multiple related operations must succeed or fail together.

### 3. SQL Support

Developers can continue using SQL while also querying JSON documents.

### 4. Relationships and Joins

PostgreSQL provides powerful joins and relationships between tables.

### 5. Constraints

Primary keys, foreign keys, unique constraints and other relational features can be used.

### 6. JSONB Indexing

JSONB supports indexes such as GIN for efficient document-style searches.

---

# 14. Limitations of PostgreSQL + JSONB

JSONB does not make PostgreSQL identical to MongoDB.

Some limitations include:

- Highly dynamic document-heavy applications may be easier to model in MongoDB.
- Excessive use of JSONB can reduce the benefits of relational database design.
- Complex JSONB structures can become difficult to maintain.
- PostgreSQL still follows a relational database architecture.
- Schema flexibility inside JSONB does not mean that the entire database becomes schema-free.

Therefore, JSONB should be used where flexible attributes are actually required.

---

# 15. Where PostgreSQL + JSONB Can Replace MongoDB

PostgreSQL with JSONB can be a good alternative to MongoDB when an application requires both relational and flexible data.

Examples include:

- E-commerce applications
- Product catalogs
- User preferences
- Configuration data
- Applications with optional attributes
- Systems requiring transactions and flexible metadata

For example, an e-commerce system may store:

```text
Product ID
Product Name
Category
Price
```

as normal relational columns while storing variable product specifications in JSONB.

---

# 16. Where MongoDB May Be a Better Choice

MongoDB can be a better fit for applications where document-oriented storage is the primary requirement.

Examples include:

- Highly document-centric applications
- Applications with rapidly changing document structures
- Large collections of independent documents
- Systems designed around document-based access patterns
- Applications where horizontal scaling of document workloads is a major requirement

MongoDB's document model can also feel more natural when the application primarily reads and writes complete documents rather than performing relational joins.

---

# 17. PostgreSQL vs MongoDB

| Feature | PostgreSQL + JSONB | MongoDB |
|---|---|---|
| Database model | Relational + document-style | Document database |
| Structured tables | Excellent | Not the primary model |
| Flexible documents | JSONB | Native documents |
| SQL | Yes | No traditional SQL |
| Joins | Strong support | Different document-oriented approaches |
| Transactions | Strong support | Supported |
| Schema flexibility | JSONB provides flexibility | Highly flexible document model |
| JSON/document indexing | GIN and other indexes | Native document indexes |
| Horizontal scaling | Available, but architecture differs | Strong document-oriented scaling model |
| Best use | Mixed relational + flexible data | Document-centric applications |

---

# 18. Transactions, Joins and Schema Enforcement

One important advantage of PostgreSQL is that JSONB can be used together with relational features.

For example, a product can have:

```text
id
name
category
price
attributes
```

The normal columns can have constraints while `attributes` provides flexibility.

PostgreSQL can also join this table with other relational tables.

For example:

```sql
SELECT
    products.name,
    products.price,
    categories.name
FROM products
JOIN categories
ON products.category = categories.name;
```

This is useful when an application requires both flexible documents and relational relationships.

---

# 19. When to Choose PostgreSQL + JSONB

PostgreSQL + JSONB should be preferred when:

- The application already uses PostgreSQL.
- Most data is relational.
- Only some attributes are dynamic.
- Transactions are important.
- SQL queries are important.
- Joins are required.
- Strong relational constraints are required.
- Flexible JSON data is needed in selected columns.

---

# 20. When to Choose MongoDB

MongoDB may be preferred when:

- The application is primarily document-oriented.
- Documents are the main unit of data.
- The schema changes frequently.
- Relational joins are not central to the application.
- The application is designed around MongoDB's document model.
- Document-oriented horizontal scaling is an important requirement.

---

# 21. Conclusion

PostgreSQL is primarily a relational database, but its `JSONB` feature allows it to handle document-style data efficiently.

A single PostgreSQL table can contain normal SQL columns such as:

```text
id
name
category
price
```

along with a flexible JSONB column:

```text
attributes
```

This provides a combination of relational database features and NoSQL-style document storage.

Compared with MongoDB, PostgreSQL + JSONB is particularly useful when an application needs transactions, joins, constraints and SQL together with flexible attributes.

However, JSONB does not make PostgreSQL a complete replacement for MongoDB in every situation. MongoDB can be more suitable for applications that are primarily document-oriented and require its particular document and scaling model.

Therefore, the choice between PostgreSQL + JSONB and MongoDB should depend on the application's data model, relationships, transaction requirements, query patterns and scaling needs.

---

## Files Included

```text
Assignment2/
│
├── assignment.sql
├── assignment.js
└── README.md
```

### `assignment.sql`

Contains:

- PostgreSQL table creation
- JSONB data insertion
- JSONB operators
- JSONB queries
- JSONB updates
- GIN index
- EXPLAIN ANALYZE
- SQL + NoSQL demonstration

### `assignment.js`

Contains:

- MongoDB connection using Mongoose
- Product schema
- Product insertion
- MongoDB document queries
- JSON-style attribute queries
- Comparison with PostgreSQL JSONB

---

## Technologies Used

- PostgreSQL
- JSONB
- SQL
- MongoDB
- Mongoose
- Node.js
- JavaScript

---

## Result

PostgreSQL's JSONB functionality was successfully explored as a way to combine relational SQL features with flexible document-style data. The experiment also demonstrated how similar product data and queries can be implemented using MongoDB and Mongoose.