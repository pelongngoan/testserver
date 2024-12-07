const JWT = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next("Authentication failed");
  }

  const token = authHeader.split(" ")[1];

  try {
    // Assuming JWT_SECRET_KEY is a string
    const userToken = JWT.verify(token, process.env.JWT_SECRET_KEY);

    // Attach userId to request body
    req.body.user = {
      userId: userToken.userId,
    };

    next();
  } catch (error) {
    next("Authentication failed");
  }
};

module.exports = userAuth;
