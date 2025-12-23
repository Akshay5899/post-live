import { useState } from "react";
import { useRouter } from "next/router";

const Register = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    photo: ""
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
        router.push("/login"); // redirect to login page
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleRegister} style={formStyle}>
      <h2>Register</h2>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <input name="mobile" placeholder="Mobile" onChange={handleChange} required />
      <input name="photo" placeholder="Photo URL" onChange={handleChange} />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;

/* ---------------- STYLES ---------------- */
const formStyle = {
  maxWidth: "400px",
  margin: "50px auto",
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  textAlign: "center",
  backgroundColor: "#f9f9f9",
};
