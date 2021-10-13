const cds = require('@sap/cds')
const request = require('request')
const WebSocket = require("ws");
module.exports = async function (srv) {

    const db = await cds.connect.to('db') // connect to database service
    const { Enrollments } = db.entities;        // get reflected definitions

    // Reduce stock of ordered books if available stock suffices
    this.on('websocketposting', async (req) => {

        var res = req._.req.res;
        const ws = new WebSocket("wss://mgwws.hana.ondemand.com/endpoints/v1/ws");
        console.log("data", req.data)
        console.log("body", Object.keys(req))
        var body = {
            "id": req.data.id,
            "from": req.data.ffrom,
            "to": req.data.to,
            "body": req.data.body,
            "type": req.data.type,
            "received_at": req.data.received_at
        };
        ws.onopen = function () {
            console.log("WebSocket Client Connected");
            ws.send(
                // JSON.stringify({ topic: "in/Orders/IKEA", body: req.body }),
                JSON.stringify({ topic: "in/social", data: req.data }),
                function () {
                    console.log("Data Sent to Web Socket Successfully");
                }
            );
            ws.close();
            ws.onclose = function (event) {
                console.log("The connection has been closed successfully.");
            };
        };
        res.send(req.data);

    });




}