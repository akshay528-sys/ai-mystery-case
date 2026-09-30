import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "./Auth.css";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { signIn } = useContext(AuthContext);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setError("");
        setIsSubmitting(true);

        try {
            const { data } = await api.post(
                "/auth/login",
                formData
            );

            if (!data.token) {
                throw new Error("The server did not return an authentication token.");
            }

            signIn(data.token);
            navigate("/dashboard", { replace: true });

        } catch (error) {
            setError(
                error.response?.data?.message ||
                error.message ||
                "Unable to log in. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="auth-screen">
            <section className="auth-panel" aria-labelledby="login-title">
                <p className="auth-eyebrow">AI Mystery Case</p>
                <h1 className="auth-title" id="login-title">Login</h1>
                <p className="auth-copy">Return to your investigation.</p>

                {location.state?.registered && (
                    <p className="auth-success" role="status">
                        Account created. You can now log in.
                    </p>
                )}
                {error && <p className="auth-error" role="alert">{error}</p>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label htmlFor="login-email">Email</label>
                <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                />

                    <label htmlFor="login-password">Password</label>
                <input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                />

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Login"}
                </button>
                </form>

                <p className="auth-switch">
                    Don&apos;t have an account? <Link to="/register">Register</Link>
                </p>
            </section>
        </main>
    );
}

export default Login;