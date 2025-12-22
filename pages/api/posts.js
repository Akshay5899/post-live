import { createRouter } from "next-connect";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../lib/cloudinary";
import connectDB from "../../lib/db";
import Post from "../../models/Post";

// ---------------- Cloudinary Storage ----------------
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "posts",
    format: async () => "jpg",
    public_id: () => Date.now().toString(),
  },
});

const upload = multer({ storage });

// ---------------- Router ----------------
const router = createRouter();

router.use(upload.single("image"));

// ---------------- POST ----------------
router.post(async (req, res) => {
  await connectDB();

  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  const image = req.file?.path || null;
  const post = await Post.create({ title, description, image });

  res.status(201).json(post);
});

// ---------------- GET ----------------
router.get(async (req, res) => {
  await connectDB();
  const posts = await Post.find().sort({ createdAt: -1 });
  res.status(200).json(posts);
});

// ---------------- PUT ----------------
router.put(async (req, res) => {
  await connectDB();
  const { id } = req.query;
  const { title, description } = req.body;

  const updateData = { title, description };
  if (req.file?.path) updateData.image = req.file.path;

  const updated = await Post.findByIdAndUpdate(id, updateData, { new: true });

  if (!updated) {
    return res.status(404).json({ error: "Post not found" });
  }

  res.status(200).json(updated);
});

// ---------------- DELETE ----------------
router.delete(async (req, res) => {
  await connectDB();
  const { id } = req.query;
  await Post.findByIdAndDelete(id);
  res.status(200).json({ success: true });
});

// ✅ THIS IS THE KEY FIX
export default router.handler({
  onError(err, req, res) {
    console.error(err);
    res.status(500).json({ error: err.message });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  },
});

// ❗ Required for multer
export const config = {
  api: {
    bodyParser: false,
  },
};
