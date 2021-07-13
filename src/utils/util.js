exports.pick = function (obj, attrs) {
    return attrs.reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
};


//If '?' character is found in url, then this function will return
//the substring containing all of the query params, starting with '?'.
//If '?' is not found, an empty string is returned.
exports.getQueryString = function (url) {
  let query = ''
  const idx = url.indexOf('?')
  if (idx != -1) query = url.substring(idx)

  return query
}
