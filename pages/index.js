import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH POSTS ---------------- */
  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  /* ---------------- ADD / UPDATE POST ---------------- */
  const submitPost = async () => {
    if (!title || !desc) {
      alert("Title and Description required");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", desc);

      // ✅ only attach image if user selected one
      if (image instanceof File) {
        formData.append("image", image);
      }

      let url = "/api/posts";
      let method = "POST";

      if (editId) {
        url = `/api/posts?id=${editId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();

      if (editId) {
        setPosts(posts.map((p) => (p._id === editId ? data : p)));
        setEditId(null);
      } else {
        setPosts((prev) => [data, ...prev]);
      }

      setTitle("");
      setDesc("");
      setImage(null);
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong. Check console.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DELETE POST ---------------- */
  const deletePost = async (id) => {
    if (!confirm("Delete this post?")) return;

    try {
      await fetch(`/api/posts?id=${id}`, { method: "DELETE" });
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "25px" }}>
        Live API Posts
      </h2>

      {/* -------- FORM -------- */}
      <div
        style={{
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          style={inputStyle}
        />

        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description"
          style={inputStyle}
        />

        <input
          type="file"
          style={inputStyle}
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          onClick={submitPost}
          disabled={loading}
          style={{
            ...btnStyle,
            backgroundColor: editId ? "#28a745" : "#0070f3",
          }}
        >
          {loading ? "Please wait..." : editId ? "Update Post" : "Add Post"}
        </button>
      </div>

      {/* -------- POSTS -------- */}
      {posts.length === 0 && <p>No posts found.</p>}

      {posts.map((p) => (
        <div key={p._id} style={cardStyle}>
          {p.image && (
            <img
              src={p.image}
              alt=""
              style={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
          )}

          <h4>{p.title}</h4>
          <p>{p.description}</p>

          <button
            style={{ ...smallBtn, background: "#ffc107", color: "#000" }}
            onClick={() => {
              setEditId(p._id);
              setTitle(p.title);
              setDesc(p.description);
            }}
          >
            Edit
          </button>

          <button
            style={{ ...smallBtn, background: "#dc3545", color: "#fff" }}
            onClick={() => deletePost(p._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const btnStyle = {
  padding: "10px 16px",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "6px",
  padding: "15px",
  marginBottom: "15px",
  backgroundColor: "#fff",
};

const smallBtn = {
  marginRight: "10px",
  padding: "6px 12px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
