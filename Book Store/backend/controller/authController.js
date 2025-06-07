// importing
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { userName, email, password } = req.body;

  //   checking if any value is null
  if (!userName || !email || !password) {
    return res.status(400).json({ error: "Please fill all the fields!" });
  }

  try {
    //   checking if user with that email already exists
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (user) {
      return res
        .status(400)
        .json({ error: "User with that email already exists!" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await prisma.user.create({
      data: {
        username: userName,
        email: email,
        password: hashedPassword,
        role: "USER",
      },
    });

    return res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if required fields are provided
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Please provide both email and password!" });
  }

  try {
    // Find user by email
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    // If user not found
    if (!user) {
      return res
        .status(404)
        .json({ error: "User with that email does not exist!" });
    }

    // Compare provided password with hashed password
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials!" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      "yourSecretKey",
      { expiresIn: "1h" }
    );

    // Set cookie with the token
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000 * 3000,
    });

    return res.status(200).json({
      message: "Login successful!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

const logout = (req, res) => {
  // Clear the authToken cookie
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({ message: "Logout successful!" });
};

module.exports = {
  signup,
  login,
  logout,
};
