import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function LandingPage() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [mounted, setMounted] = useState(false); // track mounting

  useEffect(() => {
    // ensure this runs only on client
    const t = localStorage.getItem("token");
    setToken(t || null);
    setMounted(true);
  }, []);

  if (!mounted) return null; // wait until mounted

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: "20px" }}>Welcome to Live API App</h1>

      {!token ? (
        <>
          <button
            style={btnStyle}
            onClick={() => router.push("/register")} // navigate to register
          >
            Register
          </button>

          <button
            style={{ ...btnStyle, backgroundColor: "#0070f3" }}
            onClick={() => router.push("/login")} // navigate to login
          >
            Login
          </button>
        </>
      ) : (
        <>
          <p>You are logged in!</p>
          <button style={btnStyle} onClick={() => router.push("/posts")}>
            Go to Posts
          </button>

          <button
            style={{ ...btnStyle, backgroundColor: "#dc3545" }}
            onClick={() => {
              localStorage.removeItem("token");
              setToken(null);
            }}
          >
            Sign Out
          </button>
        </>
      )}
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const containerStyle = {
  maxWidth: "500px",
  margin: "100px auto",
  textAlign: "center",
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  backgroundColor: "#f9f9f9",
};

const btnStyle = {
  display: "block",
  width: "80%",
  padding: "10px",
  margin: "10px auto",
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "16px",
};
