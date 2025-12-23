import { useState } from "react";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth?action=login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        router.push("/posts");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div style={container}>
      <form onSubmit={handleLogin} style={form}>
        <h2 style={title}>Login</h2>

        <input
          style={input}
          type="email"
          placeholder="Email address"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          style={input}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button style={button} type="submit">
          Login
        </button>

        <p style={text}>
          Don’t have an account?
          <span style={link} onClick={() => router.push("/register")}>
            {" "}Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;

/* ---------------- STYLES ---------------- */

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #667eea, #764ba2)",
};

const form = {
  width: "100%",
  maxWidth: "400px",
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
};

const title = {
  marginBottom: "20px",
  textAlign: "center",
  color: "#333",
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "15px",
};

const button = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#667eea",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  cursor: "pointer",
};

const text = {
  marginTop: "15px",
  textAlign: "center",
  fontSize: "14px",
};

const link = {
  color: "#667eea",
  cursor: "pointer",
  fontWeight: "bold",
};
