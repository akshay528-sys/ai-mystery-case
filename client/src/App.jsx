import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthContext } from "./context/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Case from "./pages/Case";
import Score from "./pages/Score";


function App() {
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    const signIn = (authToken) => {
        localStorage.setItem("token", authToken);
        setToken(authToken);
    };

    const signOut = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, signIn, signOut }}>
            <BrowserRouter>
                <Routes>

                <Route path="/" element={<Login />} />

                <Route
                    path="/register"
                    element={<Register />}
                />



                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/case"
                    element={
                        <ProtectedRoute>
                            <Case />
                        </ProtectedRoute>
                    }
                />
                
                <Route
                     path="/score"
                     element={
                        <ProtectedRoute>
                           <Score />
                        </ProtectedRoute>
    }                 />    

                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;