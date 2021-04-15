const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const receivedEvents = [];

app.post("/events", async (req, res) => {
    const event = req.body;

    try {
        await axios.post("http://post-clusterip-srv:4000/events", event);
        await axios.post("http://post-clusterip-srv:4001/events", event);
        await axios.post("http://query-clusterip-srv:4002/events", event);
        await axios.post("http://moderator-srv:4003/events", event);
    } catch (e) {

    }

    receivedEvents.push(event);

    res.send({status: 200});
});

app.get("/events", (req, res) => {
    res.send(receivedEvents);
});

app.listen(4005, () => console.log("Event bus is listening on port 4005"));