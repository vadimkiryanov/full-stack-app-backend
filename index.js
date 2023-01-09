import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import {registerValidation} from "./validations/auth.js"; // необходимо всегда указывать расширение
import {validationResult} from "express-validator"; // Проверяет есть ли ошибки в передаваемых данных формы
import UserModel from "./models/User.js";
import checkAuth from "./utils/checkAuth.js";

mongoose.set("strictQuery", false);

// Подключение к MongoDB
mongoose
  // Ссылка подключения с паролем | blog - для подключения к определенной ячейке бд
  .connect("mongodb+srv://admin:qqqqq0@cluster0.cjgokvy.mongodb.net/blog?retryWrites=true&w=majority")
  .then(() => {
    console.log("DB OK");
  })
  .catch((error) => console.log("DB error", error));

// Использованиие express
const app = express();

// Позволяет express читать json формат
app.use(express.json());

// Залогиниться
app.post("/auth/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({email: req.body.email});

    // Это пишется только для разработчиков, дабы не наделать дыр в безопасности
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash); // Сравнение паролей req.body.password и user._doc.passwordHash
    if (!isValidPassword) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    // Создание нового токена с обновленными данными
    const token = jwt.sign(
      {
        _id: user._id, // Шифрование _id при помощи JWT
      },
      "secret123", // Ключ шифрования
      {
        expiresIn: "30d", // Время жизни токена (30 дней)
      }
    );

    // Снова вытаскиваем все данные кроме passwordHash
    const {passwordHash, ...userData} = user._doc; // Достаем отдельно все данные в качестве объекта userData кроме passwordHash

    // Отправка ответа
    res.json({
      ...userData, //
      token,
      message: "Вы успешно авторизовались",
    });
  } catch (err) {
    console.log(err); // Храним для разработчика

    // Передаем информацию пользователю
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
});

// Зарегистрироваться
// post запрос по адресу "/auth/register"
// if (registerValidation) то (req, res) => {...}
app.post("/auth/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req); // Получение всех ошибок при помощи библиотеки validationResult
    // Если ошибки не пустые
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array()); // Возврашение статуса 400 и всех ошибок
    }

    // Создание шифрованного пароля
    const password = req.body.password; // Получения пароля от пользователя
    const salt = await bcrypt.genSalt(10); // Генерация шифрования пароля по переданной длине
    const passHash = await bcrypt.hash(password, salt); // 1 - сам пароль, 2 - алгоритм шифрования

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: passHash,
    });

    // Создание пользователя
    const user = await doc.save(); // Передача форматированных данных в константу

    const token = jwt.sign(
      {
        _id: user._id, // Шифрование _id при помощи JWT
      },
      "secret123", // Ключ шифрования
      {
        expiresIn: "30d", // Время жизни токена (30 дней)
      }
    );

    const {passwordHash, ...userData} = user._doc; // Достаем отдельно все данные в качестве объекта userData кроме passwordHash

    // Отправка ответа
    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err); // Храним для разработчика

    // Передаем информацию пользователю
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
});

// Получение данных после авторизации
app.get("/auth/me", checkAuth, (req, res) => {
  res.json({
    succes: true,
  });
  try {
  } catch (err) {}
});

// Присваиваем серверу порт и действие при ошибке
app.listen(4444, (error) => {
  if (error) {
    return console.log(error);
  }

  console.log("Server OK");
});
