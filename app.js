const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config();

const apiKey = process.env.API_KEY;
const serverId = process.env.SERVER;
const audId = process.env.AUD_ID;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function (req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;


    const client = require("@mailchimp/mailchimp_marketing");

    client.setConfig({
        apiKey: apiKey,
        server: serverId,
    });

    const run = async () => {
        const response = await client.lists.batchListMembers(audId, {
            members: [{
                email_address: email,
                email_type: "text",
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }],
        });
        console.log(response);
        if (response.error_count === 1) {
            res.sendFile(__dirname + "/failure.html");
        }
        else{
            res.sendFile(__dirname + "/success.html");
        }
    };
    run();
})

app.post("/failure", function (req, res) {
    res.redirect("/");
})

// process.env.PORT is used for heroku server while we want our code to run on both heroku server and our local(computer) we use || 3000.
const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server is running on port 3000");
})

