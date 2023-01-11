import {body} from "express-validator";

// Валидация регистрации
export const loginValidation = [
  body("email", "Неверный формат почты").isEmail(), // Проверка валидности email`a
  body("password", "Пароль должен быть минимум 5 символов").isLength({min: 5}), // Проверка валидности password`a на длину символов
  
];

// Регистрация
export const registerValidation = [
  body("email", "Неверный формат почты").isEmail(), // Проверка валидности email`a
  body("password", "Пароль должен быть минимум 5 символов").isLength({min: 5}), // Проверка валидности password`a на длину символов
  body("fullName", "Укажите имя").isLength({min: 3}), // Проверка валидности fullName на длину символов
  body("avatarUrl", "Неверная ссылка на аватарку").optional().isURL(), // Проверка на наличие аватарки и если есть, то является ли она ссылкой
];

// Создание постов
export const postCreateValidation = [
  body("title", "Введите заголовок статьи").isLength({min: 3}).isString(), // Проверка валидности заголовка
  body("text", "Введите текст статьи").isLength({min: 3}).isString(), // Проверка валидности текста
  body("tags", "Неверный формат тэгов (укажите массив)").optional().isString(), // Проверка на наличие и валидности tags
  body("imageUrl", "Неверная ссылка на изображение").optional().isString(), // Проверка на наличие изображения
];
