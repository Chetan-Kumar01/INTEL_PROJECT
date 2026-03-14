function successResponse(data, message = null) {
  return {
    success: true,
    ...(message && { message }),
    data,
    timestamp: new Date().toISOString()
  };
}

function errorResponse(message, statusCode = 500) {
  return {
    success: false,
    error: message,
    statusCode,
    timestamp: new Date().toISOString()
  };
}

module.exports = { successResponse, errorResponse };
