import { useState } from "react";
import { useRouter } from "next/router";

const Register = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    photo: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth?action=register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful");
        router.push("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div style={container}>
      <form onSubmit={handleRegister} style={formStyle}>
        <h2 style={title}>Create Account</h2>

        <input
          style={input}
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

        <input
          style={input}
          name="email"
          type="email"
          placeholder="Email address"
          onChange={handleChange}
          required
        />

        <input
          style={input}
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <input
          style={input}
          name="mobile"
          placeholder="Mobile Number"
          onChange={handleChange}
          required
        />

        <input
          style={input}
          name="photo"
          placeholder="Profile Photo URL (optional)"
          onChange={handleChange}
        />

        <button style={button} type="submit">
          Register
        </button>

        <p style={text}>
          Already have an account?
          <span style={link} onClick={() => router.push("/login")}>
            {" "}Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;

/* ---------------- STYLES ---------------- */

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #43cea2, #185a9d)",
};

const formStyle = {
  width: "100%",
  maxWidth: "420px",
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
  marginBottom: "14px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "15px",
};

const button = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#43cea2",
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
  color: "#43cea2",
  cursor: "pointer",
  fontWeight: "bold",
};
