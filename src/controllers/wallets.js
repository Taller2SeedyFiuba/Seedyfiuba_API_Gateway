'use strict'

const axios = require('axios');
const { services } = require('../config')

exports.mine = async(req, res, next) => {
  let reqRes = await axios.get(services.payments + '/wallets/' + req.id);
  const response = reqRes.data;

  res.status(200).json(response);
};
