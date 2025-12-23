import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function PostsPage() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  // 🔐 Protect page
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) router.push("/login");
    else setToken(t);
    setLoadingPage(false);
  }, [router]);

  // 📦 Fetch posts
  useEffect(() => {
    if (!token) return;
    const fetchPosts = async () => {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    };
    fetchPosts();
  }, [token]);

  const submitPost = async () => {
    if (!title || !desc) return alert("Title & Description required");

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    if (image instanceof File) formData.append("image", image);

    let url = "/api/posts";
    let method = "POST";
    if (editId) {
      url = `/api/posts?id=${editId}`;
      method = "PUT";
    }

    const res = await fetch(url, { method, body: formData });
    const data = await res.json();

    editId
      ? setPosts(posts.map((p) => (p._id === editId ? data : p)))
      : setPosts([data, ...posts]);

    setEditId(null);
    setTitle("");
    setDesc("");
    setImage(null);
    setLoading(false);
  };

  const deletePost = async (id) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/posts?id=${id}`, { method: "DELETE" });
    setPosts(posts.filter((p) => p._id !== id));
  };

  if (loadingPage)
    return (
      <div style={loader}>
        <h2>Loading...</h2>
      </div>
    );

  return (
    <div style={container}>
      {/* 🔝 HEADER */}
      <div style={header}>
        <h2>My Posts</h2>
        <button
          style={logoutBtn}
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* ✍️ POST FORM */}
      <div style={form}>
        <input
          style={input}
          value={title}
          placeholder="Post Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          style={textarea}
          value={desc}
          placeholder="Post Description"
          onChange={(e) => setDesc(e.target.value)}
        />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <button style={primaryBtn} onClick={submitPost} disabled={loading}>
          {loading ? "Saving..." : editId ? "Update Post" : "Create Post"}
        </button>
      </div>

      {/* 📰 POSTS */}
      <div style={grid}>
        {posts.length === 0 && <p>No posts found</p>}

        {posts.map((p) => (
          <div key={p._id} style={card}>
            {p.image && <img src={p.image} style={imageStyle} />}
            <h4>{p.title}</h4>
            <p>{p.description}</p>

            <div style={actions}>
              <button
                style={editBtn}
                onClick={() => {
                  setEditId(p._id);
                  setTitle(p.title);
                  setDesc(p.description);
                }}
              >
                Edit
              </button>
              <button style={deleteBtn} onClick={() => deletePost(p._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  minHeight: "100vh",
  background: "#f4f6f8",
  padding: "30px",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px",
};

const logoutBtn = {
  padding: "8px 14px",
  background: "#dc3545",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const form = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  marginBottom: "30px",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const textarea = {
  ...input,
  height: "80px",
};

const primaryBtn = {
  marginTop: "10px",
  background: "#0070f3",
  color: "#fff",
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "20px",
};

const card = {
  background: "#fff",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const imageStyle = {
  width: "100%",
  height: "150px",
  objectFit: "cover",
  borderRadius: "6px",
};

const actions = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "10px",
};

const editBtn = {
  background: "#ffc107",
  border: "none",
  padding: "6px 12px",
  borderRadius: "5px",
  cursor: "pointer",
};

const deleteBtn = {
  background: "#dc3545",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "5px",
  cursor: "pointer",
};

const loader = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
