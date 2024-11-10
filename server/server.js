// server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDb = require('./config/connectDb');
const userRoutes = require('./routes/userRoute');
const bookingRoutes = require('./routes/bookingRoute');
const paymentRoutes = require('./routes/paymentRoute'); 
const adminRoutes = require('./routes/adminRoute');

dotenv.config();

const app = express();


connectDb();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use('/api/v1', userRoutes);
app.use('/api/v1/parking', bookingRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1', paymentRoutes); // Payment Route

// Start server
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
