import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://passwordvault-h1fk.onrender.com/login", formData);

      localStorage.setItem("token", res.data.token);

      alert("Login Success");

      navigate("/dashboard");

    } catch (err) {
      alert("Login Failed");
      console.log(err);
    }
  };

  return (
    <div className="container">

      <h1>Login 🔐</h1>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button type="submit">Login</button>

      </form>

      <p onClick={() => navigate("/register")}>
        Don't have an account? Register
      </p>

    </div>
  );
}

export default Login;