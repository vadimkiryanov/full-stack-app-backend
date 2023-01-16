import PostModel from '../models/Post.js';

// Получение последних тегов
export const getLastTags = async (req, res) => {
  try {
    // .limit(5).exec() - доступ к 5 добавленным тегам
    // .sort({ createdAt: -1 }) - получение 5 постов с конца
    const posts = await PostModel.find().sort({ createdAt: -1 }).limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat() // Убирает вложенность, всплывая на самый верхний уровень
      .slice(0, 5); // Первые 5 элементов

    res.json(tags);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Не удалось получить теги',
    });
  }
};

// Получение всех статей
export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec(); // .populate("user").exec() - доступ к информации о user`e

    res.json(posts);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

// Получение одной статьи
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id; // Достаем динамический ID статьи
    PostModel.findOneAndUpdate(
      // Находим по параметрам:
      {
        _id: postId,
      },
      // Находим то, что хотим обновить:
      {
        $inc: { viewsCount: 1 },
      },
      // Вернуть обновленный результат
      {
        returnDocument: 'after', // Обновить после всех действий выше
      },
      // Выполняемая функция
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось вернуть статью',
          });
        }

        // Если документа нет
        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена ',
          });
        }

        res.json(doc);
      }
    ).populate('user'); // populate('user') - передать всю информацию о пользователе
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

// Обновление статьи
export const update = async (req, res) => {
  try {
    const postId = req.params.id; // Достаем динамический ID статьи

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.replace(/ /g, '').split(','), // Убираем все лишние пробелмы и превращение строк в массив,
      }
    );

    res.json({
      success: true,
      message: 'Статья успешно обновлена',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};
// Получение одной статьи
export const remove = async (req, res) => {
  try {
    const postId = req.params.id; // Достаем динамический ID статьи

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось удалить статью',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }

        res.json({
          success: true,
          message: 'Страница успешно удалена',
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

// Создание статьи
export const create = async (req, res) => {
  try {
    // Создание схемы документа
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags.replace(/ /g, '').split(','), // Убираем все лишние пробелмы и превращение строк в массив
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    // Сохранение документа для отправки
    const post = await doc.save();

    // Отправка документа
    res.json(post);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};
