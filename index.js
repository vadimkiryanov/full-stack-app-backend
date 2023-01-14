import express from 'express'; // Для автоматического обновления сервера
import multer from 'multer'; // Для загрузки файлов
import cors from 'cors'; // Для отключения защиты запросов на сервер с других доменов

import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js'; // необходимо всегда указывать расширение

import { UserController, PostController } from './controllers/index.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';

mongoose.set('strictQuery', false);

// Подключение к MongoDB
mongoose
  // Ссылка подключения с паролем | blog - для подключения к определенной ячейке бд
  .connect('mongodb+srv://admin:qqqqq0@cluster0.cjgokvy.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => {
    console.log('DB OK');
  })
  .catch((error) => console.log('DB error', error));

// Использованиие express
const app = express();

// Создание хранилища
const storage = multer.diskStorage({
  // cb - callback
  destination: (_, __, cb) => {
    cb(null, 'uploads'); // null - не получает никаких ошибок, 'uploads' - сохранять в папку такую
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname); // file.originalname - вытаскиваю оригинальное название файла
  },
});

// Применение логики хранилища на express
const upload = multer({ storage });

// Позволяет express читать json формат
app.use(express.json());
// Отключение защиты запросов
app.use(cors());
// Позволяет открывать картинки по роуту
app.use('/uploads', express.static('uploads'));

// routes
// auth
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`, // ссылка на картинку
  });
}); // upload.single('image') - ожидание файла с свойством image

// posts
app.get('/posts', PostController.getAll); // Получение всех статей
app.get('/posts/:id', PostController.getOne); // Получение 1 статьи
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create); // Создание статьи
app.delete('/posts/:id', checkAuth, PostController.remove); // Удаление статьи
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update); // Обновление статьи

// tags
app.get('/tags', PostController.getLastTags); // Получение последних тегов

// Присваиваем серверу порт и действие при ошибке
app.listen(4444, (error) => {
  if (error) {
    return console.log(error);
  }

  console.log('Server OK');
});
