import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  /* ---------------- API CALLS ---------------- */
  const fetchPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
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

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    if (image) formData.append("image", image);

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
  };

  /* ---------------- DELETE POST ---------------- */
  const deletePost = async (id) => {
    await fetch(`/api/posts?id=${id}`, { method: "DELETE" });
    setPosts(posts.filter((p) => p._id !== id));
  };

  /* ---------------- UI ---------------- */
  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#333" }}>
        Live API Posts
      </h2>

      <div
        style={{
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "30px",
        }}
      >
        <input
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <input
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description"
        />

        <input
          type="file"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          style={{
            padding: "10px 16px",
            backgroundColor: editId ? "#28a745" : "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
          onClick={submitPost}
        >
          {editId ? "Update Post" : "Add Post"}
        </button>
      </div>

      {posts.length === 0 && <p>No posts found.</p>}

      {posts.map((p) => (
        <div
          key={p._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "15px",
            marginBottom: "15px",
            backgroundColor: "#fff",
          }}
        >
          {p.image && (
            <img
              src={p.image}
              alt=""
              style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "4px" }}
            />
          )}
          <h4 style={{ margin: "10px 0 5px", color: "#222" }}>{p.title}</h4>
          <p style={{ margin: 0, color: "#555" }}>{p.description}</p>

          <button
            style={{
              marginTop: "10px",
              marginRight: "10px",
              padding: "6px 12px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
              backgroundColor: "#ffc107",
              color: "#000",
            }}
            onClick={() => {
              setEditId(p._id);
              setTitle(p.title);
              setDesc(p.description);
            }}
          >
            Edit
          </button>

          <button
            style={{
              marginTop: "10px",
              marginRight: "10px",
              padding: "6px 12px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
              backgroundColor: "#dc3545",
              color: "#fff",
            }}
            onClick={() => deletePost(p._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
