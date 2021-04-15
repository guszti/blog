const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());

app.post("/events", async (req, res) => {
    const {type, payload} = req.body;

    if (type === "CommentCreated") {
        const newPayload = {...payload, status: payload.commentContent.includes("asd") ? "declined" : "approved"};

        try {
            await axios.post("http://event-bus-srv:4005/events", {type: "CommentModerated", payload: newPayload})
        } catch (e) {
            
        }

        res.send({status: 200});
    }
});

app.listen(4003, () => {
    console.log("Moderator service is listening on port 4003.");
})