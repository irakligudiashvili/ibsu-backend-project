const mongoose = require('mongoose');
require('dotenv').config();

const PostModel = require('./models/Post');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to the database');
    seedDatabase();
})
.catch(error => {
    console.error('Database connection error:', error);
});

const seedDatabase = async () => {
    const posts = [];

    for (let i = 1; i <= 20; i++) {
        posts.push({
            title: `Post Title ${i}`,
            content: `This is the content of post number ${i}.`, // Add content field
            author: `Author ${i % 5}`,  // 5 different authors
            createdAt: new Date()
        });
    }

    try {
        await PostModel.insertMany(posts);
        console.log('Dummy data inserted successfully');
    } catch (error) {
        console.error('Error inserting dummy data:', error);
    } finally {
        mongoose.connection.close();
    }
};
