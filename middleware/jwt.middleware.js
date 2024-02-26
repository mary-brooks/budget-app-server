const { expressjwt: jwt } = require('express-jwt');

// Instantiate the JWT token validation middleware
const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'payload',
  getToken: getTokenFromHeaders,
});

function getTokenFromHeaders(req) {
  // Check if the token is available on the request headers
  // Format: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    // get the token and return it
    const token = req.headers.authorization.split(' ')[1];
    return token;
  }

  return null;
}

// Export the middleware so it can be used to protect routes
module.exports = { isAuthenticated };
