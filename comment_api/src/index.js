const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors({origin: "http://localhost:3000"}));
app.use(bodyParser.json());

const postsWithComments = {};
let lastId = 0;

app.post("/post/:id/comment", async (req, res) => {
    const postId = req.params["id"];
    const {commentContent} = req.body;

    const post = postsWithComments[postId];
    const newComment = {commentContent, id: lastId + 1, postId, status: "pending"};

    if (!!post) {
        postsWithComments[postId].push(newComment);
    } else {
        postsWithComments[postId] = [newComment]
    }

    lastId++;

    try {
        await axios.post("http://event-bus-srv:4005/events", {
            type: "CommentCreated",
            payload: {
                ...newComment
            }
        });
    } catch (e) {
        
    }

    res.status(201);
    res.send(JSON.stringify(newComment));
});

app.get("/post/:id/comment", (req, res) => {
    const postId = req.params["id"];
    const comments = postsWithComments[postId];

    res.send(JSON.stringify(comments || []));
});

app.post("/events", (req, res) => {
    const {type, payload} = req.body;

    if (type === "CommentModerated") {
        const comment = postsWithComments[payload.postId].find(item => item.id === payload.id);

        comment.status = payload.status;
    }

    res.send({status: 200});
});

app.listen(4001, () => {
    console.log("Comment api listening on port 4001");
});