const authService = require("../auth/auth-service");

function requireAuth(req, res, next) {
  const authToken = req.get("Authorization") || "";

  let bearerToken;
  if (!authToken.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "Missing bearer token" });
  } else {
    bearerToken = authToken.slice(7, authToken.length);
  }

  try {
    const payload = authService.verifyJwt(bearerToken);
    authService
      .getUserWithUsername(req.app.get("db"), payload.sub)
      .then((user) => {
        if (!user) {
          return res.status(401).json({ error: "unauthorized request" });
        }
        req.user = user;
        next();
      });
  } catch (error) {
    return res.status(401).json({ error: "unauthorized request" });
  }
}

module.exports = {
  requireAuth,
};
