"use strict";

const axios = require('axios');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//  /api/artist_search?query={artist name}
//	/api/artist_details?id={artist id}
const posts = require('./routes/posts');
app.use('/api',posts);

// Start the server
const PORT = process.env.PORT || 8080;

app.listen(PORT, function() {
    console.log(`Backend Application listening at http://localhost:${PORT}`);
});