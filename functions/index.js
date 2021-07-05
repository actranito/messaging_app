const functions = require("firebase-functions");

const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {

    // Grab the text parameter
    const original = req.query.text;

    // Push the message into Firestore using the Firebase Admin SDK
    const writeResult = await admin.firestore().collection('messages').add({original: original});

    // Send back a message that we've successfully written the message
    res.json({resutl: 'Message with ID: ${writeResult.id} added.'});
});


// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore.document('/messages/{documentId}').onCreate((snap, context) => {

    // Grab the current value of what was written to Firestore.
    const original = snap.data().original;

    //  Access the parameter `{documentId}` with `context.params`
    functions.logger.log('Uppercasing', context.params.documentId, original);
    const uppercase = original.toUpperCase();

    return snap.ref.set({uppercase: uppercase}, {merge: true});
});