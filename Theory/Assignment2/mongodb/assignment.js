// ============================================================
// Assignment 2
// MongoDB Comparison using Mongoose
// Student: Lavanya Agrawal
// ============================================================

const mongoose = require("mongoose");

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// ------------------------------------------------------------
// MongoDB Connection
// ------------------------------------------------------------


const MONGO_URI = 'mongodb+srv://lavanyakanakagrawal_db_user:hmpskanak011@todo-app.xuht0x8.mongodb.net/assignment2?retryWrites=true&w=majority';
// ------------------------------------------------------------
// Product Schema
// ------------------------------------------------------------

// attributes is intentionally flexible, similar to JSONB.

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    attributes: {
        type: mongoose.Schema.Types.Mixed
    }
});

const Product = mongoose.model("Product", productSchema);


// ------------------------------------------------------------
// Main Function
// ------------------------------------------------------------

async function main() {

    try {

        await mongoose.connect(MONGO_URI);

        console.log("Connected to MongoDB successfully");


        // ----------------------------------------------------
        // Clear previous data
        // ----------------------------------------------------

        await Product.deleteMany({});


        // ----------------------------------------------------
        // Insert products
        // ----------------------------------------------------

        await Product.insertMany([

            {
                name: "Clean Code",
                category: "book",
                price: 499,
                attributes: {
                    author: "Robert C. Martin",
                    pages: 464
                }
            },

            {
                name: "ThinkPad Laptop",
                category: "laptop",
                price: 75000,
                attributes: {
                    ram_gb: 16,
                    storage_gb: 512,
                    processor: "Intel i5",
                    wireless: true
                }
            },

            {
                name: "Wireless Mouse",
                category: "accessory",
                price: 899,
                attributes: {
                    wireless: true,
                    dpi: 1600,
                    battery: "AA"
                }
            },

            {
                name: "Mechanical Keyboard",
                category: "accessory",
                price: 2499,
                attributes: {
                    wireless: false,
                    switch: "Red",
                    backlight: true
                }
            },

            {
                name: "Java Programming",
                category: "book",
                price: 699,
                attributes: {
                    author: "Herbert Schildt",
                    pages: 720,
                    edition: 12
                }
            }

        ]);


        console.log("Products inserted successfully");


        // ----------------------------------------------------
        // Query 1: Find books
        // ----------------------------------------------------

        console.log("\nBooks:");

        const books = await Product.find({
            category: "book"
        });

        console.log(books);


        // ----------------------------------------------------
        // Query 2: Find wireless products
        // ----------------------------------------------------

        console.log("\nWireless products:");

        const wirelessProducts = await Product.find({
            "attributes.wireless": true
        });

        console.log(wirelessProducts);


        // ----------------------------------------------------
        // Query 3: Find laptops with RAM >= 16 GB
        // ----------------------------------------------------

        console.log("\nLaptops with RAM >= 16 GB:");

        const laptops = await Product.find({
            category: "laptop",
            "attributes.ram_gb": {
                $gte: 16
            }
        });

        console.log(laptops);


        // ----------------------------------------------------
        // Query 4: Check whether a field exists
        // ----------------------------------------------------

        console.log("\nProducts having author field:");

        const productsWithAuthor = await Product.find({
            "attributes.author": {
                $exists: true
            }
        });

        console.log(productsWithAuthor);


        // ----------------------------------------------------
        // Query 5: Find product by category and price
        // ----------------------------------------------------

        console.log("\nAccessories costing more than 1000:");

        const accessories = await Product.find({
            category: "accessory",
            price: {
                $gt: 1000
            }
        });

        console.log(accessories);


        // ----------------------------------------------------
        // Display all products
        // ----------------------------------------------------

        console.log("\nAll products:");

        const allProducts = await Product.find();

        console.log(allProducts);

    }

    catch (error) {

        console.error("Error:", error.message);

    }

    finally {

        await mongoose.connection.close();

        console.log("\nMongoDB connection closed");

    }
}


// Run program

main();