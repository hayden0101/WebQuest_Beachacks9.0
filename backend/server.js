const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGODB_CONNECTION_STRING, {
useNewUrlParser: true,
useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
.catch(err => console.error(err));

// Example Route
app.get('/', (req, res) => res.send('Server is running!'));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));