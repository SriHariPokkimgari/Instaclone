import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;
  try {
    if (!token)
      return res.status(401).json({
        status: 401,
        message: "not valid",
      });
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decode.id;
    next();
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "something went wrong",
    });
  }
};
