const request = require("request");
const { WebClient, LogLevel } = require("@slack/web-api");
'use strict';

/**
* @param {FaasEvent} event
* @param {FaasContext} context
* @return {Promise|*}
*/ 
 module.exports = { 
	 handler: async function (event, context) { 
	    // return event.data.challenge
	   //console.log(event.http.request);
	   
	   async function callSlack(msg,res){
    // Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
    const { WebClient, LogLevel } = require("@slack/web-api");
    
    // WebClient insantiates a client that can call API methods
    // When using Bolt, you can use either `app.client` or the `client` passed to listeners.
    const client = new WebClient("xoxb-300601539729-753018714967-Ek0JjQCqBRcVkNmDE9xD6jWf", {
      // LogLevel can be imported and used to make debugging simpler
      logLevel: LogLevel.DEBUG
    });
    // ID of the channel you want to send the message to
    const channelId = "CMVUAKUT1";
    
    try {
      // Call the chat.postMessage method using the WebClient
      const result = await client.chat.postMessage({
        channel: channelId,
        text: msg
      });
    //   res.json({ok:true});
    res.sendStatus(200).json({"text":"Hello World"});
      console.log(result);
    }
    catch (error) {
      console.error(error);
    }
   
}
	   var req=event.http.request;
	   var res=event.http.response;
        var event={}; 
        console.log(req);
    event.data=req.body;
    var item = event.data;
    if(req.headers['x-slack-retry-num']){
        return;
        // res.end();
    }
    async function apicall(opts) {
        return new Promise((resolve, reject) => {
            console.log(opts.url);
            var options = {
                url: opts.url,
                headers: opts.headers,
                method: opts.method

            };
            if ((options.method == "POST") || (options.method == "PUT") || (options.method == "PATCH")) {
                options.body = opts.payload;
            }
            request(options, (error, response, data) => {
                if (error) {
                    reject(error);
                    console.log("error" + error);
                } else {
                    resolve(data);
                }
            });
        });
    }
    
    var options_bs = {
        method: 'GET',
        url: "https://sdcplatformnextgencf.prod.apimanagement.eu10.hana.ondemand.com/sdcplatformnextgencf-backend-service/odatav4/DEFAULT/SALESORDER;v=1/SalesOrderTracker?$filter = SalesOrderID eq '"+req.body.event.text.split(" ").slice(-1)[0] +"' &$orderby=Timestamp desc",
        headers: {
            'Content-Type': 'application/json',
            'json':true
            
        },
        
    };
    
    var details = await apicall(options_bs);

    console.log(details);
    var data=JSON.parse(details).value;

        if(data.length>0){
            var ord =data[0];
            
            callSlack("sales order :"+ord.SalesOrderID+" is Delivered on "+ord.Timestamp+" in "+ord.Location+" location",res);
           
        }
        else{
            callSlack("Provided SalesOrderID Doesn't Exist");
       
    }


		 /*Enter your function's business logic here*/ 
		 return 'hello world from a function!';  
	  }
 }