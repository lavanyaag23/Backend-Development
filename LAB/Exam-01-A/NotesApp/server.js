const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = 3000;

// MongoDB configuration
const MONGO_URI =
  "mongodb://lavanyakanakagrawal_db_user:hmpskanak011@ac-qbiuz3l-shard-00-00.xuht0x8.mongodb.net:27017,ac-qbiuz3l-shard-00-01.xuht0x8.mongodb.net:27017,ac-qbiuz3l-shard-00-02.xuht0x8.mongodb.net:27017/notes-app?ssl=true&replicaSet=atlas-1bfkm4-shard-0&authSource=admin&retryWrites=true&w=majority";
const client = new MongoClient(MONGO_URI);

let notesCollection;

// EJS configuration
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();

        const database = client.db("notes_lab");
        notesCollection = database.collection("notes");

        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

// Home page - display all notes
app.get("/", async (req, res) => {
    try {
        const notes = await notesCollection
            .find()
            .sort({ createdAt: -1 })
            .toArray();

        res.render("index", {
            notes: notes
        });
    } catch (error) {
        res.status(500).send("Error loading notes");
    }
});

// Display add-note form
app.get("/notes/new", (req, res) => {
    res.render("new-note");
});

// Add a new note
app.post("/notes", async (req, res) => {
    try {
        const { title, content, category } = req.body;

        // Validation
        if (!title || !title.trim() || !content || !content.trim()) {
            return res.status(400).send("Title and content are required.");
        }

        await notesCollection.insertOne({
            title: title.trim(),
            content: content.trim(),
            category: category ? category.trim() : "General",
            createdAt: new Date()
        });

        res.redirect("/");
    } catch (error) {
        res.status(500).send("Error adding note");
    }
});

// Delete a note
app.post("/notes/:id/delete", async (req, res) => {
    try {
        await notesCollection.deleteOne({
            _id: new ObjectId(req.params.id)
        });

        res.redirect("/");
    } catch (error) {
        res.status(500).send("Error deleting note");
    }
});

// Start server after MongoDB connection
async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();