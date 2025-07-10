import express from "express";
import Book from "../models/Book.js";
import cloudinary from "../lib/cloudinary.js";
import protectRoute from "../middleware/authMiddleware.js";

const router = express.Router();

//create a new book

router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;
    if (!title || !caption || !rating || !image) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    //upload image to cloudinary
    const uploadedImage = await cloudinary.uploader.upload(image);
    const imageUrl = uploadedImage.secure_url;

    //save to database
    const book = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//update a book

router.put("/:id", protectRoute, async (req, res) => {
  try {
    let { title, caption, rating, image } = req.body;
    if (!title || !caption || !rating || !image) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "You are not authorized to update this book" });
    }
    // If the image is updated, delete the old image from cloudinary
    if (image !== book.image) {
      if (book.image && book.image.includes("cloudinary")) {
        try {
          const publicId = book.image.split("/").pop().split(".")[0]; // Extract public ID from the image URL
          await cloudinary.uploader.destroy(publicId); // Delete the old image from Cloudinary
        } catch (error) {
          console.error("Error deleting old image from cloudinary:", error);
          return res
            .status(500)
            .json({ message: "Failed to delete old image from cloudinary" });
        }
      }
      // Upload the new image to cloudinary
      const uploadedImage = await cloudinary.uploader.upload(image);
      image = uploadedImage.secure_url; // Update the image URL with the new one
    }
    // Update the book details
    book.title = title;
    book.caption = caption;
    book.rating = rating;
    book.image = image; // Update the image URL
    await book.save(); // Save the updated book to the database
    res.status(200).json(book); // Respond with the updated book
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get a book by id

router.get("/:id", protectRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "user",
      "username profileImage"
    );
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get all books

router.get("/", protectRoute, async (req, res) => {
  try {
    const page = req.query.page || 1; // Get the page number from query parameters, default to 1
    const limit = req.query.limit || 5; // Number of books per page
    const skip = (page - 1) * limit; // Calculate the number of books to skip based on the page number

    const books = await Book.find()
      .sort({ createdAt: -1 }) // Sort books by creation date in descending order
      .skip(skip) // Skip the calculated number of books
      .limit(limit) // Limit the number of books to the specified limit
      .populate("user", "username profileImage");

    const totalBooks = await Book.countDocuments(); // Get the total number of books in the database

    res.send({
      books,
      currentPage: page,
      totalBooks: await Book.countDocuments(), // Get the total number of books in the database
      totalPages: Math.ceil(totalBooks / limit), // Calculate the total number of pages
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//delete a book

router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "You are not authorized to delete this book" });
    }

    // Delete the image from cloudinary
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0]; // Extract public ID from the image URL
        await cloudinary.uploader.destroy(publicId); // Delete the image from Cloudinary
      } catch (error) {
        console.error("Error deleting image from cloudinary:", error);
        return res
          .status(500)
          .json({ message: "Failed to delete image from cloudinary" });
      }
    }

    await book.deleteOne();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get recomendation books by logged user

router.get("/user", protectRoute, async (req, res) => {
  try {
    const books = await Book.find(
      { user: req.user._id }.sort({ createdAt: -1 })
    ); // Find books by the logged-in user
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching user books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
