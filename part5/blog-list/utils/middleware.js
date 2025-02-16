const logger = require("./logger");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  }
  next();
}

const getToken = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  }
}

// sets the User object to the request.user variable
// to be used specifically with certain routes, thus can't assume that the token is set
const userExtractor = async (request, response, next) => {
  getToken(request);
  if (!request.token) {
    return response.status(401).send(); // unauthorized / unauthenticated
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  const userid = decodedToken.id;
  const user = await User.findById(userid);
  // if the user corresponding to the token is not found in the database, it still means the authentication process has failed.
  // The client has provided credentials, but they do not correspond to a valid user. Therefore, a 401 Unauthorized status code is still appropriate.
  if (!user) {
    return response.status(401).json({ error: "user not found" });
  }

  request.user = user;
  next();
}


module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
};
