const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './views');

// Home
app.get('/', (req, res) => {
  res.send('Welcome to Lavanya Agrawal - Express Server!');
});

// Plain text response
app.get('/text', (req, res) => {
  res.send('This is a plain text response from Lavanya\'s Express server');
});

// HTML response
app.get('/html', (req, res) => {
  res.send('<h1>HTML Response</h1><p>Welcome to Lavanya Agrawal\'s Backend Development Lab</p>');
});

// JSON response
app.get('/json', (req, res) => {
  res.json({
    message: 'This is a JSON response',
    status: 'success',
    data: {
      name: 'Lavanya Agrawal',
      rollNo: '590014327',
      course: 'Backend Development'
    }
  });
});

// User by ID
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;

  res.json({
    message: 'User details',
    userId: userId,
    name: 'Lavanya Agrawal',
    email: 'lavanyaagrawal259@gmail.com'
  });
});

// Search
app.get('/search', (req, res) => {
  const { q, page, limit } = req.query;

  res.json({
    searchQuery: q,
    page: page || 1,
    limit: limit || 10
  });
});

// Calculator
app.get('/calculate', (req, res) => {
  const { num1, num2, operation } = req.query;

  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);

  let result;

  switch (operation) {
    case 'add':
      result = n1 + n2;
      break;

    case 'subtract':
      result = n1 - n2;
      break;

    case 'multiply':
      result = n1 * n2;
      break;

    case 'divide':
      result = n2 !== 0 ? n1 / n2 : 'Error';
      break;

    default:
      result = 'Invalid operation';
  }

  res.json({
    num1: n1,
    num2: n2,
    operation,
    result
  });
});

// Register
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  res.json({
    message: 'Registration successful',
    user: {
      username,
      email
    }
  });
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (
    email === 'lavanyaagrawal259@gmail.com' &&
    password === 'pass123'
  ) {
    res.json({
      success: true,
      message: 'Login successful',
      token: 'sample-jwt-token'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// EJS Home
app.get('/home', (req, res) => {
  res.render('home', {
    title: 'Lavanya Agrawal - Home',
    heading: 'Welcome to EJS Templating',
    message: 'EJS makes it easy to generate dynamic HTML'
  });
});

// Users
app.get('/users', (req, res) => {
  const users = [
    {
      id: 1,
      name: 'Lavanya Agrawal',
      email: 'lavanyaagrawal259@gmail.com'
    },
    {
      id: 2,
      name: 'Aarav Sharma',
      email: 'aarav@example.com'
    },
    {
      id: 3,
      name: 'Diya Verma',
      email: 'diya@example.com'
    }
  ];

  res.render('users', { users });
});

// Profile
app.get('/profile/:id', (req, res) => {
  const user = {
    id: req.params.id,
    name: 'Lavanya Agrawal',
    email: 'lavanyaagrawal259@gmail.com',
    age: 20,
    city: 'Dehradun'
  };

  res.render('profile', { user });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  console.log('Available endpoints:');
  console.log('  GET  / - Welcome message');
  console.log('  GET  /text - Plain text');
  console.log('  GET  /html - HTML response');
  console.log('  GET  /json - JSON response');
  console.log('  GET  /user/:id - User by ID');
  console.log('  GET  /search?q=term - Search');
  console.log('  GET  /calculate?num1=10&num2=5&operation=add');
  console.log('  POST /register - Register user');
  console.log('  POST /login - Login user');
  console.log('  GET  /home - EJS home page');
  console.log('  GET  /users - Users list');
  console.log('  GET  /profile/:id - User profile');
});