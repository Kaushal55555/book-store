// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Authentication middleware that verifies JWT tokens
 * and attaches the user ID to the request object
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Authentication failed: No authorization header provided",
      });
    }

    // Extract token from header
    // Format: "Bearer [token]"
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        error: "Authentication failed: No token provided",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, "yourSecretKey");

      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        return res.status(401).json({
          error: "Authentication failed: Token expired",
        });
      }

      // Check if user exists in database
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        return res.status(401).json({
          error: "Authentication failed: User not found",
        });
      }

      // Attach user ID to request object
      req.userId = decoded.id;
      req.userRole = user.role;

      // Continue to the next middleware or route handler
      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          error: "Authentication failed: Invalid token",
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      error: "Server error during authentication",
    });
  }
};

module.exports = authMiddleware;
