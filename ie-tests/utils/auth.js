const request = require('supertest');

const testUnauthorized = (app, method, path, done) => {
  request(app)
  [method](path)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(401, done);
}

const testAuthorized = (app, method, path, token, data = undefined) => {
  return request(app)
    [method](path)
    .send(data)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .expect('Content-Type', /json/)
}

module.exports = {
  testUnauthorized,
  testAuthorized,
}