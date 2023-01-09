import jwt from "jsonwebtoken";

// Создание middleware

export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  // Если токен есть
  if (token) {
    try {
      const decoded = jwt.verify(token, "secret123"); // Расшифровка токена

      req.userId = decoded._id; // вшиваем расшифрованный токен в полученный запрос
      next(); // пропускаем к выполнению следующего действия
    } catch (error) {
      return res.status(403).json({
        message: "Нет доступа-1", // return исправляет ошибку наличия двух result
      });
    }
  } else {
    // Если токена нет
    return res.status(403).json({
      message: "Нет доступа-2", // return исправляет ошибку наличия двух result
    });
  }
  //   next();
};
