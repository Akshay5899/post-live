// /pages/api/posts.js
import connectDB from "../../lib/db";
import Post from "../../models/Post";

export const config = {
  api: {
    bodyParser: true, // enable JSON body parsing
  },
};

export default async function handler(req, res) {
  try {
    await connectDB(); // connect to MongoDB
  } catch (err) {
    console.error("MongoDB connection error:", err);
    return res.status(500).json({ error: "Database connection failed" });
  }

  // ----------------- GET: Fetch All Posts -----------------
  if (req.method === "GET") {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });
      return res.status(200).json(posts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      return res.status(500).json({ error: "Fetch failed", details: err.message });
    }
  }

  // ----------------- POST: Add Post -----------------
  if (req.method === "POST") {
    try {
      const { title, description, image } = req.body; // image should be a URL
      if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required" });
      }
      const post = await Post.create({ title, description, image: image || null });
      return res.status(201).json(post);
    } catch (err) {
      console.error("Error adding post:", err);
      return res.status(500).json({ error: "Add failed", details: err.message });
    }
  }

  // ----------------- PUT: Update Post -----------------
  if (req.method === "PUT") {
    try {
      const { id } = req.query;
      const { title, description, image } = req.body;
      const updated = await Post.findByIdAndUpdate(
        id,
        { title, description, image },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ error: "Post not found" });
      }
      return res.status(200).json(updated);
    } catch (err) {
      console.error("Error updating post:", err);
      return res.status(500).json({ error: "Update failed", details: err.message });
    }
  }

  // ----------------- DELETE: Delete Post -----------------
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      const deleted = await Post.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ error: "Post not found" });
      }
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Error deleting post:", err);
      return res.status(500).json({ error: "Delete failed", details: err.message });
    }
  }

  // ----------------- METHOD NOT ALLOWED -----------------
  res.status(405).json({ error: "Method not allowed" });
}
