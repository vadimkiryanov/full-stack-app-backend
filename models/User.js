import mongoose from "mongoose";

// Схема пользователя
const UserShema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // email должен быть уникальным
    },
    // Для безопасности паролей пользователей
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String,
  },
  // При создании/обновлении данных - создается время при котором это произошло
  {
    timestamps: true,
  }
);

// Экспорт всего этого
export default mongoose.model("User", UserShema);
