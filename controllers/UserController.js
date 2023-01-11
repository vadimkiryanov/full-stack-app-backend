import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../models/User.js";

export const register = async (req, res) => {
  try {
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
};

export const login = async (req, res) => {
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
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId); // Найти пользователя по переданному ID

    // Если нет пользователя
    if (!user) {
      return res.status(404).json({
        message: "Такого пользователя не существует",
      });
    }

    const {passwordHash, ...userData} = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Нет доступа",
    });
  }
};
