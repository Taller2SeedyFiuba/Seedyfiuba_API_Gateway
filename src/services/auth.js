'use strict';

const admin = require("firebase-admin");

const { hocError } = require("../errors/handler");
const { ApiError } = require("../errors/ApiError");
const errMsg = require("../errors/messages")


const configJson = process.env.FIREBASE_KEY || "{}";

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(configJson))
});

exports.authorize = async function (req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw ApiError.notAuthorized(errMsg.MISSING_AUTH_HEADER);
  }

  const token = authHeader.substring(7, authHeader.length);
  let decodedToken;

  try {
    decodedToken = await admin.auth().verifyIdToken(token);
  } catch (err) {
    throw ApiError.notAuthorized(errMsg.INVALID_AUTH_HEADER);
  }

  const uid = decodedToken.uid;
  req.id = uid;
  next();
};
