const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = 3000;

// MongoDB configuration
const MONGO_URI =
    "mongodb://lavanyakanakagrawal_db_user:hmpskanak011@ac-qbiuz3l-shard-00-00.xuht0x8.mongodb.net:27017,ac-qbiuz3l-shard-00-01.xuht0x8.mongodb.net:27017,ac-qbiuz3l-shard-00-02.xuht0x8.mongodb.net:27017/notes-app?ssl=true&replicaSet=atlas-1bfkm4-shard-0&authSource=admin&retryWrites=true&w=majority";

const DB_NAME = "cms_lab";

let client;
let db;
let postsCollection;

// EJS
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to MongoDB
async function connectDB() {
    try {
        client = new MongoClient(MONGO_URI);

        await client.connect();

        db = client.db(DB_NAME);
        postsCollection = db.collection("posts");

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

// Home page
app.get("/", async (req, res) => {
    try {
        const posts = await postsCollection
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        res.render("posts", {
            posts: posts
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading posts");
    }
});

// GET /posts
app.get("/posts", async (req, res) => {
    try {
        const posts = await postsCollection
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        res.render("posts", {
            posts: posts
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading posts");
    }
});

// GET /posts/new
app.get("/posts/new", (req, res) => {
    res.render("new-post", {
        error: null
    });
});

// POST /posts
app.post("/posts", async (req, res) => {
    try {
        const { title, content, author } = req.body;

        // Validation
        if (
            !title ||
            !title.trim() ||
            !content ||
            !content.trim() ||
            !author ||
            !author.trim()
        ) {
            return res.status(400).render("new-post", {
                error: "Title, content and author are required."
            });
        }

        const newPost = {
            title: title.trim(),
            content: content.trim(),
            author: author.trim(),
            createdAt: new Date()
        };

        await postsCollection.insertOne(newPost);

        res.redirect("/posts");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating post");
    }
});

// GET /posts/:id
app.get("/posts/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(404).send("Post not found");
        }

        const post = await postsCollection.findOne({
            _id: new ObjectId(id)
        });

        if (!post) {
            return res.status(404).send("Post not found");
        }

        res.render("post", {
            post: post
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading post");
    }
});

// Start server
async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

startServer();