const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const postsWithComments = {};

const handleEvent = (type, payload) => {
    switch (type) {
        case "PostCreated":
            postsWithComments[payload.id] = {...payload, comments: []};

            break;
        case "CommentCreated":
            postsWithComments[payload.postId].comments.push(payload);

            break;
        case "CommentModerated":
            const comment = postsWithComments[payload.postId].comments.find(item => item.id === payload.id);

            comment.status = payload.status;

            break;
        default:
            throw new Error("Something went HORRIBLY wrong!");
    }
}

app.get("/posts", (req, res) => {
    res.send(JSON.stringify(postsWithComments));
});

app.post("/events", (req, res) => {
    const {type, payload} = req.body;

    handleEvent(type, payload);

    res.send({status: 200});
});

app.listen(4002, async () => {
    console.log("Query service is listening on port 4002");

    try {
        const {data} = await axios.get("http://event-bus-srv:4005/events");

        for (let event of data) {
            handleEvent(event.type, event.payload);
        }
    } catch (e) {

    }
});
