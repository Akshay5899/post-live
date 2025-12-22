import nextConnect from "next-connect";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../lib/cloudinary";
import connectDB from "../../lib/db";
import Post from "../../models/Post";

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "posts", // folder in Cloudinary
    format: async (req, file) => "jpg", // convert all images to jpg
    public_id: (req, file) => Date.now() + "-" + file.originalname, // unique filename
  },
});

const upload = multer({ storage });

// Use nextConnect for middleware support
const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(500).json({ error: error.message });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  },
});

apiRoute.use(upload.single("image")); // expects "image" field

// ----------------- POST: Add Post -----------------
apiRoute.post(async (req, res) => {
  try {
    await connectDB();
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const image = req.file?.path || null; // Cloudinary URL
    const post = await Post.create({ title, description, image });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: "Add failed", details: err.message });
  }
});

// ----------------- GET: Fetch All Posts -----------------
apiRoute.get(async (req, res) => {
  try {
    await connectDB();
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
});

// ----------------- PUT: Update Post -----------------
apiRoute.put(async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;
    const { title, description } = req.body;
    const image = req.file?.path || undefined; // optional update

    const updated = await Post.findByIdAndUpdate(
      id,
      { title, description, ...(image && { image }) },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
});

// ----------------- DELETE: Delete Post -----------------
apiRoute.delete(async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;
    const deleted = await Post.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed", details: err.message });
  }
});

export default apiRoute;
export const config = { api: { bodyParser: false } }; // required for multer
