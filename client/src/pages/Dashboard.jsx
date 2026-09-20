import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    useEffect(() => {

        const getUser = async () => {
            try {

                const response = await api.get("/auth/me");

                setUser(response.data.user);

            } catch (error) {

                console.error(
                    "Failed to get user:",
                    error.response?.data
                );

            }
        };

        getUser();

    }, []);

    if (!user) {
        return <h2>Loading...</h2>;
    }
    const handleLogout = () => {
    localStorage.removeItem("token");

    window.location.href = "/";
};

    return (
        <div>

            <h1>AI Mystery Case 🕵️</h1>

            <h2>Welcome, {user.name}</h2>

            <p>Email: {user.email}</p>

           <button onClick={() => navigate("/case")}>
    Start Mystery Case
</button>

            <button onClick={handleLogout}>
                Logout
            </button>

        </div>
    );
}

export default Dashboard;