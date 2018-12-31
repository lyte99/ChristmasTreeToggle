var AWS=require('aws-sdk');
var iotdata = new AWS.IotData({endpoint: 'IOT ENDPOINT HERE'});
var getparams; 
var set_params;
var date = new Date();
var time = date.toString();


exports.handler = (event, context) => {
    
  try {

    if (event.session.new) {
      // New Session
      console.log("NEW SESSION");
    }

    switch (event.request.type) {

      case "LaunchRequest":
        // Launch Request
        console.log(`LAUNCH REQUEST`);

        break;

      case "IntentRequest":
        // Intent Request
        console.log(`INTENT REQUEST`);

        switch(event.request.intent.name) {

            
            
          case "Turnontree":

            getparams = {
            thingName: 'Christmas_Tree' /* required */
              };
              
              iotdata.getThingShadow(getparams, function(err, data) {
                if (err) 
                {
                    console.log(err, err.stack);
                    
                } // an error occurred
                else     
                {
              //  console.log(JSON.parse(data.payload));           // successful response
              var shadowobject = JSON.parse(data.payload);
              var returned_val = shadowobject.state.reported.state;
              var currenttreestate = returned_val;
                
                    if (currenttreestate =="OFF")
                    {
                        //turn it on
                        console.log('calling toggle tree function.');

                        //parameters to set  CHANGE STATE TO ON
                        set_params = {
                      //payload: '{"state":{"desired": {"state": "ON","timestamp": "Mon Dec 26 2016 20:11:38 GMT-0600 (CST)"},"reported": {"state": "OFF","timestamp": "Mon Dec 26 2016 20:11:38 GMT-0600 (CST)"}}}',  
                      payload: '{"state":{"desired": {"state": "ON","timestamp": "' + time +'"},"reported": {"state": "OFF","timestamp": "' + time +'"}}}',  
                      thingName: 'Christmas_Tree' /* required */
                    };

                                //moved it to an outside function, it would not run here for some reason.
                              toggletree(set_params, "'OK, Turning on the tree.'", context);
                        
                    }
                    else
                    {
                        console.log("Tree is already on");
                              context.succeed(generateResponse(buildSpeechletResponse('The tree is already on. Unable to complete request.', true),{}));
                    }
 
                }
                }); 

            break;
            
          case "Turnofftree":

            getparams = {
            thingName: 'Christmas_Tree' /* required */
              };
              
              iotdata.getThingShadow(getparams, function(err, data) {
                if (err) 
                {
                    console.log(err, err.stack);
                    
                } // an error occurred
                else     
                {
              //  console.log(JSON.parse(data.payload));           // successful response
              var shadowobject = JSON.parse(data.payload);
              var returned_val = shadowobject.state.reported.state;
              var currenttreestate = returned_val;
                
                    if (currenttreestate =="ON")
                    {
                        //turn it off
                        console.log('calling toggle tree function.');

                        //parameters to set  CHANGE STATE TO OFF
                    set_params = {
                      payload: '{"state":{"desired": {"state": "OFF","timestamp": "' + time +'"},"reported": {"state": "ON","timestamp": "' + time +'"}}}',  
                      thingName: 'Christmas_Tree' /* required */
                    };

                                //moved it to an outside function, it would not run here for some reason.
                              toggletree(set_params, "'OK, Turning off the tree.'", context);
                        
                    }
                    else
                    {
                        console.log("Tree is already off");
                              context.succeed(generateResponse(buildSpeechletResponse('The tree is already off. Unable to complete request.', true),{}));
                    }
 
                }
                }); 

            break;

          case "Toggletree":

            getparams = {
            thingName: 'Christmas_Tree' /* required */
              };
              
              iotdata.getThingShadow(getparams, function(err, data) {
                if (err) 
                {
                    console.log(err, err.stack);
                    
                } // an error occurred
                else     
                {
              //  console.log(JSON.parse(data.payload));           // successful response
              var shadowobject = JSON.parse(data.payload);
              var returned_val = shadowobject.state.reported.state;
              var currenttreestate = returned_val;
                
                    if (currenttreestate =="ON")
                    {
                        //turn it off
                        console.log('calling toggle tree function.');

                        //parameters to set  CHANGE desired STATE TO OFF
                    set_params = {
                      payload: '{"state":{"desired": {"state": "OFF","timestamp": "' + time +'"},"reported": {"state": "ON","timestamp": "' + time +'"}}}',  
                      thingName: 'Christmas_Tree' /* required */
                    };

                                //moved it to an outside function, it would not run here for some reason.
                              toggletree(set_params, "'OK, Turning off the tree.'", context);
                        
                    }
                    else
                    {
           
                        //parameters to set  CHANGE desired STATE to ON
                        var set_params = {
                      payload: '{"state":{"desired": {"state": "ON","timestamp": "' + time +'"},"reported": {"state": "OFF","timestamp": "' + time +'"}}}',  
                      thingName: 'Christmas_Tree' /* required */
                    };

                                //moved it to an outside function, it would not run here for some reason.
                              toggletree(set_params, "'OK, Turning on the tree.'", context);
                    }
 
                }
                }); 

            break;


          default:
            throw "Invalid intent";
        }

        break;

      case "SessionEndedRequest":
        // Session Ended Request
        console.log(`SESSION ENDED REQUEST`);
        break;

      default:
        context.fail(`INVALID REQUEST TYPE: ${event.request.type}`);



    }

  } catch(error) { context.fail(`Exception: ${error}`) }

console.log('THE END');

};

// Helpers
buildSpeechletResponse = (outputText, shouldEndSession) => {
//console.log('building speech response: '+ outputText);
  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    shouldEndSession: shouldEndSession
  };

};

generateResponse = (speechletResponse, sessionAttributes) => {
//console.log("generating response");
  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  };

};

//change the state of the tree to the new parameters
function toggletree(set_params, response,  context)
{
    console.log('tunontree reached.  trying to update state.');
    
                    //update IOT Shadow
                    iotdata.updateThingShadow(set_params, function(err, data) {
                      if (err) {
                          console.log('an error ocured updating shadow');
                          console.log(err, err.stack)} // an error occurred
                      else{     //console.log(data);           // successful response
                         console.log("Shadow Updated Successfully");
                         
                         context.succeed(generateResponse(buildSpeechletResponse(response, true),{}));
                         
                         }                       
  
                      //callback();
                    });
                    
}
  

