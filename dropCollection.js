const mongoose = require('mongoose');
require('dotenv').config();

// Ensure MONGO_URI is defined in your .env file
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error('MONGO_URI is not defined in the environment variables.');
    process.exit(1);
}

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log("Connected to MongoDB");
        try {
            await mongoose.connection.db.dropCollection('tasks');
            console.log("Collection dropped");
        } catch (err) {
            if (err.code === 26) {
                console.log("Collection not found, skipping drop.");
            } else {
                console.error("Error dropping collection:", err);
            }
        } finally {
            process.exit(0);
        }
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    });
