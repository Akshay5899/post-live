import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  /* ---------------- STYLES ---------------- */
  const styles = {
    container: {
      maxWidth: "700px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    },
    heading: {
      textAlign: "center",
      marginBottom: "25px",
      color: "#333",
    },
    form: {
      background: "#f9f9f9",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      marginBottom: "30px",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "12px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      fontSize: "14px",
    },
    button: {
      padding: "10px 16px",
      backgroundColor: "#0070f3",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "14px",
    },
    updateBtn: {
      padding: "10px 16px",
      backgroundColor: "#28a745",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "14px",
    },
    postCard: {
      border: "1px solid #ddd",
      borderRadius: "6px",
      padding: "15px",
      marginBottom: "15px",
      backgroundColor: "#fff",
    },
    postTitle: {
      margin: "10px 0 5px",
      color: "#222",
    },
    postDesc: {
      margin: 0,
      color: "#555",
    },
    actionBtn: {
      marginTop: "10px",
      marginRight: "10px",
      padding: "6px 12px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "13px",
    },
    editBtn: {
      backgroundColor: "#ffc107",
      color: "#000",
    },
    deleteBtn: {
      backgroundColor: "#dc3545",
      color: "#fff",
    },
    image: {
      width: "100%",
      maxHeight: "200px",
      objectFit: "cover",
      borderRadius: "4px",
    },
  };

  /* ---------------- API CALLS ---------------- */
  const fetchPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const addPost = async () => {
    if (!title || !desc) {
      alert("Title and Description required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    if (image) formData.append("image", image);

    const res = await fetch("/api/posts", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setPosts((prev) => [data, ...prev]);
    setTitle("");
    setDesc("");
    setImage(null);
  };

  const deletePost = async (id) => {
    await fetch(`/api/posts?id=${id}`, { method: "DELETE" });
    setPosts(posts.filter((p) => p._id !== id));
  };

  const updatePost = async () => {
    const res = await fetch(`/api/posts?id=${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description: desc }),
    });

    const data = await res.json();
    setPosts(posts.map((p) => (p._id === editId ? data : p)));
    setEditId(null);
    setTitle("");
    setDesc("");
  };

  /* ---------------- UI ---------------- */
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Live API Posts</h2>

      <div style={styles.form}>
        <input
          style={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <input
          style={styles.input}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description"
        />

        <input
          type="file"
          style={styles.input}
          onChange={(e) => setImage(e.target.files[0])}
        />

        {editId ? (
          <button style={styles.updateBtn} onClick={updatePost}>
            Update Post
          </button>
        ) : (
          <button style={styles.button} onClick={addPost}>
            Add Post
          </button>
        )}
      </div>

      {posts.length === 0 && <p>No posts found.</p>}

      {posts.map((p) => (
        <div key={p._id} style={styles.postCard}>
          {p.image && <img src={p.image} alt="" style={styles.image} />}
          <h4 style={styles.postTitle}>{p.title}</h4>
          <p style={styles.postDesc}>{p.description}</p>

          <button
            style={{ ...styles.actionBtn, ...styles.editBtn }}
            onClick={() => {
              setEditId(p._id);
              setTitle(p.title);
              setDesc(p.description);
            }}
          >
            Edit
          </button>

          <button
            style={{ ...styles.actionBtn, ...styles.deleteBtn }}
            onClick={() => deletePost(p._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
