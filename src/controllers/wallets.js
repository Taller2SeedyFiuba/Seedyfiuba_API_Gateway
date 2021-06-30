'use strict'

const axios = require('axios');

const PAYMENT_URL = process.env.PAYMENT_GTW_MS;

exports.mine = async(req, res, next) => {
  let reqRes = await axios.get(PAYMENT_URL + '/wallets/' + req.id);
  const response = reqRes.data;

  res.status(200).json(response);
};