import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Score() {
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                const response = await api.get("/cases/attempts");
                setData(response.data);
            } catch (error) {
                console.error(
                    "Failed to fetch score:",
                    error.response?.data || error.message
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAttempts();
    }, []);

    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "Arial, sans-serif"
                }}
            >
                <h2>⏳ Loading detective dashboard...</h2>
            </div>
        );
    }

    if (!data) {
        return (
            <div
                style={{
                    textAlign: "center",
                    marginTop: "80px",
                    fontFamily: "Arial, sans-serif"
                }}
            >
                <h2>Unable to load dashboard.</h2>

                <button
                    onClick={() => navigate("/case")}
                    style={{
                        padding: "10px 18px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#212529",
                        color: "#fff",
                        cursor: "pointer"
                    }}
                >
                    Back to Mystery
                </button>
            </div>
        );
    }

    const solvedCount = data.attempts.filter(
        (attempt) => attempt.correct
    ).length;

    const wrongCount = data.attempts.filter(
        (attempt) => !attempt.correct
    ).length;

    return (
        <div
            style={{
                maxWidth: "1000px",
                margin: "0 auto",
                padding: "30px",
                fontFamily: "Arial, sans-serif",
                color: "#212529"
            }}
        >
            {/* Header */}
            <div
                style={{
                    textAlign: "center",
                    marginBottom: "25px"
                }}
            >
                <h1
                    style={{
                        fontSize: "34px",
                        marginBottom: "10px"
                    }}
                >
                    🕵️ Detective Dashboard
                </h1>

                <p
                    style={{
                        color: "#666",
                        fontSize: "16px"
                    }}
                >
                    Track your investigation performance and
                    mystery-solving history.
                </p>
            </div>

            {/* Navigation */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                    marginBottom: "35px"
                }}
            >
                <button
                    onClick={() => navigate("/case")}
                    style={{
                        padding: "11px 18px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#212529",
                        color: "#fff",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    🕵️ Solve New Mystery
                </button>

                <button
                    onClick={() => navigate("/dashboard")}
                    style={{
                        padding: "11px 18px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        background: "#fff",
                        color: "#212529",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    🏠 Dashboard
                </button>
            </div>

            {/* Statistics */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "18px",
                    marginBottom: "40px"
                }}
            >
                {/* Total Score */}
                <div
                    style={{
                        padding: "25px",
                        border: "1px solid #ddd",
                        borderRadius: "14px",
                        textAlign: "center",
                        background: "#f8f9fa",
                        boxShadow:
                            "0 3px 10px rgba(0,0,0,0.06)"
                    }}
                >
                    <div style={{ fontSize: "32px" }}>
                        🏆
                    </div>

                    <h3>Total Score</h3>

                    <p
                        style={{
                            fontSize: "32px",
                            fontWeight: "bold",
                            margin: 0
                        }}
                    >
                        {data.totalScore}
                    </p>
                </div>

                {/* Cases Attempted */}
                <div
                    style={{
                        padding: "25px",
                        border: "1px solid #ddd",
                        borderRadius: "14px",
                        textAlign: "center",
                        background: "#f8f9fa",
                        boxShadow:
                            "0 3px 10px rgba(0,0,0,0.06)"
                    }}
                >
                    <div style={{ fontSize: "32px" }}>
                        🔎
                    </div>

                    <h3>Cases Attempted</h3>

                    <p
                        style={{
                            fontSize: "32px",
                            fontWeight: "bold",
                            margin: 0
                        }}
                    >
                        {data.totalAttempts}
                    </p>
                </div>

                {/* Solved */}
                <div
                    style={{
                        padding: "25px",
                        border: "1px solid #ddd",
                        borderRadius: "14px",
                        textAlign: "center",
                        background: "#f8f9fa",
                        boxShadow:
                            "0 3px 10px rgba(0,0,0,0.06)"
                    }}
                >
                    <div style={{ fontSize: "32px" }}>
                        ✅
                    </div>

                    <h3>Solved</h3>

                    <p
                        style={{
                            fontSize: "32px",
                            fontWeight: "bold",
                            margin: 0
                        }}
                    >
                        {solvedCount}
                    </p>
                </div>

                {/* Wrong */}
                <div
                    style={{
                        padding: "25px",
                        border: "1px solid #ddd",
                        borderRadius: "14px",
                        textAlign: "center",
                        background: "#f8f9fa",
                        boxShadow:
                            "0 3px 10px rgba(0,0,0,0.06)"
                    }}
                >
                    <div style={{ fontSize: "32px" }}>
                        ❌
                    </div>

                    <h3>Wrong</h3>

                    <p
                        style={{
                            fontSize: "32px",
                            fontWeight: "bold",
                            margin: 0
                        }}
                    >
                        {wrongCount}
                    </p>
                </div>
            </div>

            {/* Case History */}
            <div>
                <h2
                    style={{
                        marginBottom: "8px"
                    }}
                >
                    📜 Case History
                </h2>

                <p
                    style={{
                        color: "#666",
                        marginBottom: "20px"
                    }}
                >
                    Review your previous investigations and
                    results.
                </p>

                {data.attempts.length === 0 ? (
                    <div
                        style={{
                            padding: "35px",
                            textAlign: "center",
                            background: "#f8f9fa",
                            border: "1px solid #ddd",
                            borderRadius: "12px"
                        }}
                    >
                        <h3>
                            🔎 No cases attempted yet.
                        </h3>

                        <p>
                            Start your first investigation to
                            build your detective record.
                        </p>

                        <button
                            onClick={() => navigate("/case")}
                            style={{
                                padding: "11px 18px",
                                border: "none",
                                borderRadius: "8px",
                                background: "#212529",
                                color: "#fff",
                                cursor: "pointer"
                            }}
                        >
                            Start Investigation
                        </button>
                    </div>
                ) : (
                    data.attempts.map((attempt) => (
                        <div
                            key={attempt.id}
                            style={{
                                padding: "22px",
                                marginBottom: "18px",
                                border: "1px solid #ddd",
                                borderRadius: "14px",
                                background: "#fff",
                                boxShadow:
                                    "0 3px 10px rgba(0,0,0,0.06)"
                            }}
                        >
                            {/* Case title */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems: "center",
                                    gap: "15px",
                                    flexWrap: "wrap",
                                    marginBottom: "15px"
                                }}
                            >
                                <h3
                                    style={{
                                        margin: 0
                                    }}
                                >
                                    🕵️{" "}
                                    {attempt.mysteryCase.title}
                                </h3>

                                <span
                                    style={{
                                        padding: "6px 12px",
                                        borderRadius: "20px",
                                        background:
                                            "#e9ecef",
                                        fontWeight: "bold",
                                        fontSize: "14px"
                                    }}
                                >
                                    🎯{" "}
                                    {
                                        attempt.mysteryCase
                                            .difficulty
                                    }
                                </span>
                            </div>

                            {/* Details */}
                            <div
                                style={{
                                    lineHeight: "1.7"
                                }}
                            >
                                <p>
                                    <strong>
                                        Your Answer:
                                    </strong>{" "}
                                    {attempt.suspect}
                                </p>

                                <p>
                                    <strong>
                                        Result:
                                    </strong>{" "}
                                    {attempt.correct ? (
                                        <span>
                                            ✅ Correct
                                        </span>
                                    ) : (
                                        <span>
                                            ❌ Wrong
                                        </span>
                                    )}
                                </p>

                                <p>
    <strong>
        Score:
    </strong>{" "}
    <span
        style={{
            fontWeight: "bold",
            fontSize: "18px"
        }}
    >
        {attempt.score}
    </span>{" "}
    points
</p>

<p
    style={{
        marginBottom: 0,
        color: "#777",
        fontSize: "14px"
    }}
>
    📅 Attempted:{" "}
    {new Date(attempt.createdAt).toLocaleString()}
</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Bottom Action */}
            <div
                style={{
                    textAlign: "center",
                    marginTop: "35px",
                    paddingBottom: "30px"
                }}
            >
                <button
                    onClick={() => navigate("/case")}
                    style={{
                        padding: "12px 22px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#212529",
                        color: "#fff",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    🕵️ Start Another Investigation
                </button>
            </div>
        </div>
    );
}

export default Score;