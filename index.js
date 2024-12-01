// index.js
const app = require('./src/app');  // Import the app from app.js
const dotenv = require('dotenv');  // To load environment variables from .env file
dotenv.config();  // Configure dotenv

const PORT = process.env.PORT || 8080;  // Set port from environment variable or default to 8080

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
