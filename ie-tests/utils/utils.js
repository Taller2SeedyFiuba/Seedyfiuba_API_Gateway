
const randomEmail = function(){
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let result = '';
  for(var i=0; i<15; ++i){
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result.concat('@mail.com')
}

module.exports = {
  randomEmail
}
