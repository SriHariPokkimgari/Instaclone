import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;
  try {
    if (!token)
      return resizeBy.status(401).json({
        status: 401,
        message: "not valid",
      });
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.end();
  }
};
