import {validationResult} from "express-validator"; // Проверяет есть ли ошибки в передаваемых данных формы

export default (req, res, next) => {
  const errors = validationResult(req); // Получение всех ошибок при помощи библиотеки validationResult
  // Если ошибки не пустые
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array()); // Возврашение статуса 400 и всех ошибок
  }

  next();
};
