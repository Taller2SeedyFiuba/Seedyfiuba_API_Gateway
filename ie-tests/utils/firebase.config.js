// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");

const configJson = process.env.FIREBASE_CLIENT || "{}";


// Initialize Firebase
firebase.initializeApp(JSON.parse(configJson));

const users = {
  entrepreneur: {
    email: 'entrepreneur@test.com',
    pass: 'Qwe12345',
    uid: 'f8MPMhialjZCCB2yUMZjCPG5yTs1',
  },
  sponsor: {
    email: 'sponsor@test.com',
    pass: 'Qwe12345',
    uid: 'qDzHIJjwNqSm8HEN308LeQXHnbq2',
  },
}

const firebaseLoginUser = async ({ email, pass }) => {
  const userCredential = await firebase.auth().signInWithEmailAndPassword(email, pass);
  return userCredential.user;
}

const firebaseCreateUser = async ({ email, pass }) => {
  const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, pass);
  return userCredential.user;
}

const getIdToken = async () => {
  const user = await firebase.auth().currentUser;
  const token = user.getIdToken(/* forceRefresh */ true);
  return token;
}

const getUid = async () => {
  const user = await firebase.auth().currentUser;
  return user.uid;
}

module.exports = {
  users,
  firebaseLoginUser,
  firebaseCreateUser,
  getIdToken,
  getUid,
}