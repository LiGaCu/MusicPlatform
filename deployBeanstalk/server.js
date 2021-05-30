"use strict";

const axios = require('axios');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname,'dist/frontend-jiatong')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/*',function(req,res){
    res.sendFile(path.join(__dirname + '/dist/frontend-jiatong/index.html'));
});

// Start the server
const PORT = process.env.PORT || 8080;

app.listen(PORT, function() {
    console.log(`Backend Application listening at http://192.168.1.32:${PORT}`);
});