// Experiment 05
// PBL Activity: Library Book Management

const library = [];


// Function to add a book
function addBook(title, author) {

    const book = {
        title: title,
        author: author
    };

    library.push(book);

    console.log("Book added:", book);
}


// Function to find a book by title
function findBook(title) {

    const book = library.find(function (book) {
        return book.title.toLowerCase() === title.toLowerCase();
    });

    return book;
}


// Test the functions

addBook("Clean Code", "Robert C. Martin");
addBook("Java Programming", "Herbert Schildt");
addBook("The Pragmatic Programmer", "Andrew Hunt");

console.log("\n--- Library ---");
console.log(library);

console.log("\n--- Search Result ---");

const result = findBook("Clean Code");

if (result) {
    console.log("Book found:", result);
} else {
    console.log("Book not found");
}