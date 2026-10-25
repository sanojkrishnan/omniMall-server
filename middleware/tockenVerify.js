const { verifyUserToken, verifyAdminToken } = require("../utils/jwt");

const getToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token");
  }

  return authHeader.split(" ")[1];
};

// handles every auth failure and logs the reason
const handleAuthError = (err, res) => {
  console.log("AUTH FAIL:", err.message);
  return res.status(401).json({
    message:
      err.message === "Token expired" ? "Token expired" : "Invalid token",
  });
};
// user verification
const userAuth = (req, res, next) => {
  try {
    const token = getToken(req);

    const decoded = verifyUserToken(token);

    req.user = decoded;

    next();
  } catch (err) {
    return handleAuthError(err, res);
  }
};
// admin verification
const adminAuth = (req, res, next) => {
  try {
    const token = getToken(req);

    const decoded = verifyAdminToken(token);
    console.log("DECODED:", decoded);

    req.admin = decoded;

    next();
  } catch (err) {
    return handleAuthError(err, res);
  }
};

module.exports = { userAuth, adminAuth };
