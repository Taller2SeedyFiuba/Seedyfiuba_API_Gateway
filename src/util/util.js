exports.pick = function (obj, attrs) {
    return attrs.reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
};
