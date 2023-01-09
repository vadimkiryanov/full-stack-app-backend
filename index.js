import express from "express";
import jwt from "jsonwebtoken";

// Использованиие express
const app = express();

// Позволяет express читать json формат
app.use(express.json());

// Если сервер получает get запрос на '/' главную страницу
app.get("/", (req, res) => {
  res.send("Hello world!");
});

// post запрос по адресу "/auth/login"
app.post("/auth/login", (req, res) => {
  // Вывод в консоль запроса - body
  console.log(req.body);
  // Шифрование информации при помощи JWT
  const token = jwt.sign(
    {
      email: req.body.email,
      fullName: "Вася пупкин",
    },
    "secret123"
  );

  // Получение ответа от сервера
  res.json({
    succes: true,
    token, // возвращаем токен в response
  });
});

// Присваиваем серверу порт и действие при ошибке
app.listen(4444, (error) => {
  if (error) {
    return console.log(error);
  }

  console.log("Server OK");
});
