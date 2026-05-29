import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {

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

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/register", formData);

      alert("Register Success");

      navigate("/");

    } catch (err) {
      alert("Register Failed");
      console.log(err);
    }
  };

  return (
    <div className="container">

      <h1>Register 📝</h1>

      <form onSubmit={handleRegister}>

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

        <button type="submit">Register</button>

      </form>

      <p onClick={() => navigate("/")}>
        Already have account? Login
      </p>

    </div>
  );
}

export default Register;