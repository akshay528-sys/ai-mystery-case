import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Case from "./pages/Case";
import Score from "./pages/Score";


function App() {
    return (
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
    );
}

export default App;