const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.use(
    session({
        secret: "my-secret-key",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 30
        }
    })
);

// Home page
app.get("/", (req, res) => {
    if (!req.session.todos) {
        req.session.todos = [];
    }

    const theme = req.cookies.theme || "light";

    res.render("index", {
        todos: req.session.todos,
        theme: theme
    });
});

// Add todo
app.post("/add", (req, res) => {
    if (!req.session.todos) {
        req.session.todos = [];
    }

    const todo = req.body.todo;

    if (todo && todo.trim() !== "") {
        req.session.todos.push(todo.trim());
    }

    res.redirect("/");
});

// Delete todo
app.post("/delete/:index", (req, res) => {
    const index = parseInt(req.params.index);

    if (req.session.todos) {
        req.session.todos.splice(index, 1);
    }

    res.redirect("/");
});

// Change theme
app.post("/theme", (req, res) => {
    const theme = req.body.theme;

    res.cookie("theme", theme, {
        maxAge: 1000 * 60 * 60 * 24 * 30
    });

    res.redirect("/");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});