import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ---------------- STATES ----------------

  const [passwords, setPasswords] = useState([]);
  const [showPasswordId, setShowPasswordId] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    website: "",
    username: "",
    password: "",
  });

  // ---------------- FETCH PASSWORDS ----------------

  const fetchPasswords = useCallback(async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/get-passwords",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPasswords(res.data);

    } catch (err) {

      console.log("Error fetching passwords:", err);

    }

  }, [token]);

  // ---------------- USE EFFECT ----------------

  useEffect(() => {

    if (!token) {

      navigate("/");
      return;

    }

    const initFetch = async () => {
      try {
        await fetchPasswords();
      } catch (err) {
        console.log("Error fetching passwords:", err);
      }
    };

    initFetch();

  }, [token, navigate, fetchPasswords]);

  // ---------------- HANDLE INPUT ----------------

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // ---------------- GENERATE PASSWORD ----------------

  const generatePassword = () => {

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";

    let generated = "";

    for (let i = 0; i < 12; i++) {

      generated += chars.charAt(
        Math.floor(Math.random() * chars.length)
      );

    }

    setFormData({
      ...formData,
      password: generated,
    });

  };

  // ---------------- SAVE PASSWORD ----------------

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:5000/add-password",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Password Saved Successfully");

      setFormData({
        website: "",
        username: "",
        password: "",
      });

      fetchPasswords();

    } catch (err) {

      console.log("Save Error:", err);

    }
  };

  // ---------------- DELETE PASSWORD ----------------

  const deletePassword = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/delete-password/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Password Deleted Successfully");

      fetchPasswords();

    } catch (err) {

      console.log("Delete Error:", err);

    }
  };

  // ---------------- COPY PASSWORD ----------------

  const copyPassword = (password) => {

    navigator.clipboard.writeText(password);

    alert("Password Copied");

  };

  // ---------------- LOGOUT ----------------

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/");

  };

  // ---------------- FILTER PASSWORDS ----------------

  const filteredPasswords = passwords.filter((item) =>
    item.website.toLowerCase().includes(search.toLowerCase())
  );

  // ---------------- UI ----------------

  return (

    <div className="dashboard-container">

      {/* NAVBAR */}

      <div className="navbar">

        <h1>PasswordVault 🔐</h1>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* FORM SECTION */}

      <div className="form-section">

        <h2>Add Password</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="website"
            placeholder="Enter Website"
            value={formData.website}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="button"
            className="generate-btn"
            onClick={generatePassword}
          >
            Generate Strong Password
          </button>

          <button
            type="submit"
            className="save-btn"
          >
            Save Password
          </button>

        </form>

      </div>

      {/* SEARCH SECTION */}

      <div className="search-section">

        <input
          type="text"
          placeholder="Search Website..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* TABLE SECTION */}

      <div className="table-section">

        <h2>Saved Passwords</h2>

        {filteredPasswords.length === 0 ? (

          <p>No passwords found</p>

        ) : (

          <table>

            <thead>

              <tr>

                <th>Website</th>
                <th>Username</th>
                <th>Password</th>
                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {filteredPasswords.map((item) => (

                <tr key={item._id}>

                  <td>{item.website}</td>

                  <td>{item.username}</td>

                  <td>
                    {showPasswordId === item._id
                      ? item.password
                      : "********"}
                  </td>

                  <td>

                    <button
                      className="action-btn show-btn"
                      onClick={() =>
                        setShowPasswordId(
                          showPasswordId === item._id
                            ? null
                            : item._id
                        )
                      }
                    >
                      {showPasswordId === item._id
                        ? "Hide"
                        : "Show"}
                    </button>

                    <button
                      className="action-btn copy-btn"
                      onClick={() => copyPassword(item.password)}
                    >
                      Copy
                    </button>

                    <button
                      className="action-btn delete-btn"
                      onClick={() => deletePassword(item._id)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>

  );
};

export default Dashboard;