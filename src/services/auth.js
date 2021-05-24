'use strict';

const admin = require("firebase-admin");

const { hocError } = require("../errors/handler");
const { ApiError } = require("../errors/ApiError");

const configJson = process.env.FIREBASE_KEY || "{}";

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(configJson))
});

exports.authorize = async function (req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw ApiError.notAuthorized('missing-auth-header');
  }

  const token = authHeader.substring(7, authHeader.length);
  let decodedToken;

  try {
    decodedToken = await admin.auth().verifyIdToken(token);
  } catch (err) {
    throw ApiError.notAuthorized('invalid-auth-header');
  }

  const uid = decodedToken.uid;
  req.id = uid;
  next();
};

// exports.isAdmin = function (req, res, next) {
//   let token = req.body.token || req.query.token || req.headers['x-access-token'];

//   if (!token) {
//     res.status(401).json({
//       message: 'Token Inválido'
//     });
//   } else {
//     jwt.verify(token, global.SALT_KEY, function (error, decoded) {
//       if (error) {
//         res.status(401).json({
//           message: 'Token Inválido'
//         });
//       } else {
//         if (decoded.roles.includes('admin')) {
//           next();
//         } else {
//           res.status(403).json({
//             message: 'Funcionalidade restrita'
//           });
//         }
//       }
//     });
//   }
// };