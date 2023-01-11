import mongoose from "mongoose";

// Схема пользователя
const PostShema = new mongoose.Schema(
  {
    // Уникальынй _id создается автоматически
    title: {
      type: String,
      required: true,
      unique: true, // уникальность
    },
    text: {
      type: String,
      required: true,
    },

    tags: {
      type: Array,
      default: [], // default - значение по умолчанию
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // специальный тип
      ref: "User", // ref - ссылаться на модель 'User'
      required: true,
    },
    imageUrl: String,
  },
  // При создании/обновлении данных - создается время при котором это произошло
  {
    timestamps: true,
  }
);

// Экспорт всего этого
export default mongoose.model("Post", PostShema);
