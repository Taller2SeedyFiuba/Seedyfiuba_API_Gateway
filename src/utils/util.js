exports.pick = function (obj, attrs) {
    return attrs.reduce(function (result, key) {
        if (obj[key] != undefined){
          result[key] = obj[key];
        }
        return result;
    }, {});
};


//If '?' character is found in url, then this function will return
//the substring containing all of the query params, starting with '?'.
//If '?' is not found, an empty string is returned.
exports.getQueryString = function (url, addQueryParams=undefined) {
  let query = ''
  let idx = url.indexOf('?')
  let sep = "?"
  if (idx != -1){
    query = url.substring(idx)
    sep = "&"
  }
  if (addQueryParams){
    query.concat(toQueryString(addQueryParams, sep))
  }
  return query
}

exports.toQueryString = function (queryParams, sep="?") {
  let query = ''
  for ([k, v] of Object.entries(queryParams)){
    if (v instanceof Array){
      v.forEach(elem => {
        query = query.concat(`${sep}${k}=${elem}`);
        sep = "&"
      })
    } else {
      query = query.concat(`${sep}${k}=${v}`);
      sep = "&"
    }
  }
  return query
}
