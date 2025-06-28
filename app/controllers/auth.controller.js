const AuthServiceClass = require("../services/auth.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../JWT.env") });

exports.register = async (req, res, next) => {
  const AuthService = new AuthServiceClass(MongoDB.client);
  const document = req.body;

  // Kiểm tra user có tồn tại chưa
  const userExists = await AuthService.findByName(document.username);
  if (userExists) {
    return next(new ApiError(400, "User already exists"));
  }

  // Băm mật khẩu
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
  const hashedPassword = await bcrypt.hash(document.password, salt);

  // Tạo User mới
  const newUser = { username: document.username, password: hashedPassword };
  const createdUser = await AuthService.create(newUser);
  if (!createdUser) {
    return next(new ApiError(500, "Failed to create user"));
  }
  return res.json(createdUser);
};

exports.authenticate = async (req, res, next) => {
  const AuthService = new AuthServiceClass(MongoDB.client);
  const document = req.body;

  // Tìm User trong database
  const user = await AuthService.findByName(document.username);
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  // Kiểm tra mật khẩu
  const isPasswordValid = await bcrypt.compare(
    document.password,
    user.password
  );
  if (!isPasswordValid) {
    return next(new ApiError(401, "Invalid credentials"));
  }

  // Tạo token đăng nhập
  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
  return res.json({ token });
};

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new ApiError(401, "Access denied: No token provided"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ApiError(400, "Invalid token"));
  }
};
