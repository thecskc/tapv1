const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();
const { PubSub } = require("@google-cloud/pubsub");



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// To test the scheduled function locally
const pubsub = new PubSub({
    apiEndpoint: 'localhost:8085' // Change it to your PubSub emulator address and port
  });
  
  setInterval(async () => {
    const SCHEDULED_FUNCTION_TOPIC = 'firebase-schedule-updateTeamRoomsCount';
    console.log(`Trigger sheduled function via PubSub topic: ${SCHEDULED_FUNCTION_TOPIC}`);
    const msg = await pubsub.topic(SCHEDULED_FUNCTION_TOPIC).publishJSON({
      foo: 'bar',
    }, { attr1: 'value1' });
  }, 60 * 1000); // every 5 minutes

exports.updateTeamRoomsCount = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
    console.log('This will be run every 1 minute');

    const fetch = require('node-fetch');
    const TOKEN = '5a5860293d5c2da106b9601a6c11215efcb1508e5d3f156f18b2f621f931b269';

    const url = 'https://api.daily.co/v1/presence';
    const options = {method: 'GET', headers: {Accept: 'application/json', Authorization: `Bearer ${TOKEN}`}};

    fetch(url, options)
    .then(res => res.json())
    .then((json) => {
        console.log(json);
        for(const room in json) {
            const participants = json[room].length;
            let roomURL = 'https://theworklab.daily.co/' + room;

            admin.firestore().collection("teamrooms").where("room_url", "==", roomURL).get().then(querySnapshot => {
                // console.log(query);
                // const thing = query.docs[0];
                // console.log(thing.data());
                // let tmp = thing.data();
                // tmp.population = participants;
                // console.log(tmp);
                // thing.ref.update(tmp);
                console.log(querySnapshot);
                if (querySnapshot.size > 0) {
                    // Contents of first document
                    console.log(querySnapshot.docs[0].data());
                  } else {
                    console.log("No such document!");
                  }
                querySnapshot.forEach((doc) => {
                    
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                    let tmp = doc.data();
                    tmp.population = participants;
                    doc.ref.update(tmp);
                });
            });
        }

    })
    .catch(err => console.error('error:' + err));


    return null;
});
