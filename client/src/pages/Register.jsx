import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
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

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post(
                "/auth/register",
                {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password
                }
            );

            navigate("/", { replace: true, state: { registered: true } });

        } catch (error) {
            setError(
                error.response?.data?.message ||
                error.message ||
                "Unable to create your account. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="auth-screen">
            <section className="auth-panel" aria-labelledby="register-title">
                <p className="auth-eyebrow">AI Mystery Case</p>
                <h1 className="auth-title" id="register-title">Create account</h1>
                <p className="auth-copy">Join the investigation.</p>

                {error && <p className="auth-error" role="alert">{error}</p>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label htmlFor="register-name">Name</label>
                <input
                    id="register-name"
                    name="name"
                    autoComplete="name"
                    placeholder="Name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                />

                    <label htmlFor="register-email">Email</label>
                <input
                    id="register-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                />

                    <label htmlFor="register-password">Password</label>
                <input
                    id="register-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                />

                    <label htmlFor="register-confirm-password">Confirm password</label>
                <input
                    id="register-confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating account..." : "Register"}
                </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/">Login</Link>
                </p>
            </section>
        </main>
    );
}

export default Register;