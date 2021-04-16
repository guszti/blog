const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json({type: "application/json"}));
app.use(cors());

const posts = {};

app.post("/post/create", async (req, res) => {
    const {title} = req.body;
    const id = Object.keys(posts).length + 1;
    const post = {id, title};

    posts[id] = post;

    try {
        await axios.post("http://event-bus-srv:4005/events", {
            type: "PostCreated",
            payload: post
        });
    } catch (e) {
        
    }

    res.status(201);

    res.send(JSON.stringify({id, ...post}));
});

app.get("/post", (req, res) => {
    res.send(JSON.stringify(posts));
});

app.post("/events", (req, res) => {
    res.send({status: 200});
})

app.listen(4000, () => {
    console.log("Post api is listening on port 4000.")
})
