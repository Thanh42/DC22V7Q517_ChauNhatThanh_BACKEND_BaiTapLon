class ApiError extends Error {
  constructor(statusCode, message) {
    super(); //gọi contructor của lớp cha Error
    this.statusCode = statusCode;
    this.message = message;
  }
}
module.exports = ApiError;
