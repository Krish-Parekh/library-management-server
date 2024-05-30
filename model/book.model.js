import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Author",
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 13,
      maxlength: 13,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);
