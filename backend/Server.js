const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TransactionRoutes = require('./routes/TransactionRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', TransactionRoutes);

// Connect to MongoDB
mongoose.connect('mongodb+srv://omkarabhang36:jfse89EZ9kvbmMMR@roxiler-database.xhq01.mongodb.net/transactionDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.listen(5000, () => console.log('https://roxiler-backend-1ukq.onrender.com'));
