import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post(
                "/auth/login",
                formData
            );

            console.log("Login response:", response.data);

            // Save JWT token
            localStorage.setItem(
                "token",
                response.data.token
            );

            // Get logged-in user
            const meResponse = await api.get("/auth/me");

            console.log(
                "Logged in user:",
                meResponse.data.user
            );

            // Go to Case page after successful login
            navigate("/case");

        } catch (error) {
            console.error(
                "Login failed:",
                error.response?.data || error.message
            );
        }
    };

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <button type="submit">
                    Login
                </button>

            </form>
        </div>
    );
}

export default Login;