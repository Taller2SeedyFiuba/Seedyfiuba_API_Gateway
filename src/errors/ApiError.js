class ApiError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }
  
  static notAuthorized(message) {
    return new ApiError(401, message)
  }
  
  static badRequest(message) {
    return new ApiError(400, message);
  }

  static notFound(message) {
    return new ApiError(404, message);
  }

  static serverError(message) {
    return new ApiError(500, message);
  }
};

module.exports = { ApiError };
