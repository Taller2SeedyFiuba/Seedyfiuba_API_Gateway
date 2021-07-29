const faker = require('faker');

const randomEmail = function(){
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let result = '';
  for(var i=0; i<12; ++i){
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result.concat('@mail.com')
}

const getFakeProject = function(){
  const data = {
    "title": faker.commerce.productName(),
    "description": faker.lorem.paragraphs(),
    "type": "arte",
    "location": {
      "description": faker.address.cityName(),
      "lat": Number(faker.address.latitude()),
      "lng": Number(faker.address.longitude())
    },
    "tags": [
      faker.lorem.word().concat(faker.lorem.word()),
      faker.lorem.word().concat(faker.lorem.word()),
      faker.lorem.word().concat(faker.lorem.word()),
    ],
    "multimedia": [
      "https://picsum.photos/400/300",
      "https://picsum.photos/400/300",
      "https://picsum.photos/400/300"
    ],
    "stages": [
      {
        "title": faker.commerce.department(),
        "description": faker.company.catchPhrase(),
        "amount": parseFloat(Math.random().toPrecision(2).toString())//.replace(/\.?0+$/,"")
      },
      {
        "title": faker.commerce.department(),
        "description": faker.company.catchPhrase(),
        "amount": parseFloat(Math.random().toPrecision(2).toString())//.replace(/\.?0+$/,"")
      },
    ]
  }
  return data
}

module.exports = {
  randomEmail,
  getFakeProject
}
