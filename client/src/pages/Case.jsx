import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Case() {
    const navigate = useNavigate();

    const [mysteryCase, setMysteryCase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    const [selectedSuspect, setSelectedSuspect] = useState("");
    const [result, setResult] = useState("");

    // Interrogation states
    const [interrogationQuestion, setInterrogationQuestion] = useState("");
    const [interrogationAnswer, setInterrogationAnswer] = useState("");
    const [interrogating, setInterrogating] = useState(false);
    const [interrogationHistory, setInterrogationHistory] = useState([]);

    // Fetch existing case
    useEffect(() => {
        const fetchCase = async () => {
            try {
                const response = await api.get("/cases");

                const cases = response.data.cases;

                if (cases.length > 0) {
                    setMysteryCase(cases[0]);
                }
            } catch (error) {
                console.error(
                    "Failed to fetch case:",
                    error.response?.data || error.message
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCase();
    }, []);

    // Fetch interrogation history
    useEffect(() => {
        const fetchInterrogationHistory = async () => {
            if (!mysteryCase) {
                return;
            }

            try {
                const response = await api.get(
                    `/cases/interrogations/${mysteryCase.id}`
                );

                setInterrogationHistory(
                    response.data.interrogations
                );
            } catch (error) {
                console.error(
                    "Failed to fetch interrogation history:",
                    error.response?.data || error.message
                );
            }
        };

        fetchInterrogationHistory();
    }, [mysteryCase]);

    // Generate new AI mystery
    const handleGenerateMystery = async () => {
        try {
            setGenerating(true);

            setResult("");
            setSelectedSuspect("");
            setInterrogationQuestion("");
            setInterrogationAnswer("");
            setInterrogationHistory([]);

            const response = await api.post("/cases/generate");


            setMysteryCase(response.data.mysteryCase);
        } catch (error) {
            console.error(
                "Failed to generate mystery:",
                error.response?.data || error.message
            );

            setResult(
                "Failed to generate mystery. Please try again."
            );
        } finally {
            setGenerating(false);
        }
    };

    // Interrogate selected suspect
    const handleInterrogation = async () => {
        if (!selectedSuspect) {
            setInterrogationAnswer(
                "Please select a suspect first."
            );
            return;
        }

        if (!interrogationQuestion.trim()) {
            setInterrogationAnswer(
                "Please enter a question."
            );
            return;
        }

        if (!mysteryCase) {
            return;
        }

        try {
            setInterrogating(true);
            setInterrogationAnswer("");

            const response = await api.post(
                "/cases/interrogate",
                {
                    caseId: mysteryCase.id,
                    suspect: selectedSuspect,
                    question: interrogationQuestion
                }
            );

            setInterrogationAnswer(
                response.data.answer
            );

            // Add new interrogation to visible history
            setInterrogationHistory((prev) => [
                ...prev,
                {
                    id: response.data.interrogationId,
                    suspect: selectedSuspect,
                    question: interrogationQuestion,
                    answer: response.data.answer
                }
            ]);

            setInterrogationQuestion("");
        } catch (error) {
            console.error(
                "Interrogation failed:",
                error.response?.data || error.message
            );

            setInterrogationAnswer(
                "The suspect could not answer. Please try again."
            );
        } finally {
            setInterrogating(false);
        }
    };

    // Submit accusation
    const handleAccusation = async () => {
        if (!selectedSuspect) {
            setResult("Please select a suspect.");
            return;
        }

        if (!mysteryCase) {
            return;
        }

        try {
            const response = await api.post(
                `/cases/${mysteryCase.id}/solve`,
                {
                    suspect: selectedSuspect
                }
            );

            setResult(
    `${response.data.message} Score: ${response.data.score} points.`
);
        } catch (error) {
            console.error(
                "Failed to submit accusation:",
                error.response?.data || error.message
            );

            setResult("Something went wrong.");
        }
    };

    // Initial loading
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
                <h2>⏳ Loading mystery...</h2>
            </div>
        );
    }

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
                        marginBottom: "10px",
                        fontSize: "34px"
                    }}
                >
                    🕵️ AI Mystery Case
                </h1>

                <p
                    style={{
                        color: "#666",
                        fontSize: "16px"
                    }}
                >
                    Investigate the case, interrogate suspects,
                    and uncover the truth.
                </p>
            </div>

            {/* Top Actions */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "15px",
                    flexWrap: "wrap",
                    marginBottom: "25px"
                }}
            >
                <button
                    onClick={() => navigate("/score")}
                    style={{
                        padding: "11px 18px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#6f42c1",
                        color: "#fff",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    🏆 Detective Dashboard
                </button>

                <button
                    onClick={handleGenerateMystery}
                    disabled={generating}
                    style={{
                        padding: "11px 18px",
                        border: "none",
                        borderRadius: "8px",
                        background: generating
                            ? "#999"
                            : "#212529",
                        color: "#fff",
                        fontWeight: "bold",
                        cursor: generating
                            ? "not-allowed"
                            : "pointer"
                    }}
                >
                    {generating
                        ? "⏳ Generating Mystery..."
                        : "✨ Generate New Mystery"}
                </button>
            </div>

            {!mysteryCase ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: "50px",
                        background: "#f8f9fa",
                        borderRadius: "12px"
                    }}
                >
                    <h2>No mystery cases found.</h2>

                    <p>
                        Generate a new mystery to start investigating.
                    </p>
                </div>
            ) : (
                <>
                    {/* Mystery Information */}
                    <div
                        style={{
                            background: "#f8f9fa",
                            padding: "25px",
                            borderRadius: "12px",
                            marginBottom: "30px",
                            border: "1px solid #ddd"
                        }}
                    >
                        <h2
                            style={{
                                marginTop: 0,
                                marginBottom: "15px"
                            }}
                        >
                            📁 {mysteryCase.title}
                        </h2>

                        <p
                            style={{
                                lineHeight: "1.7",
                                color: "#444",
                                marginBottom: "20px"
                            }}
                        >
                            {mysteryCase.description}
                        </p>

                        <div
                            style={{
                                display: "inline-block",
                                padding: "7px 14px",
                                borderRadius: "20px",
                                background: "#e9ecef",
                                fontWeight: "bold"
                            }}
                        >
                            🎯 Difficulty: {mysteryCase.difficulty}
                        </div>
                    </div>

                    {/* Suspects */}
                    <h3
                        style={{
                            marginTop: "30px",
                            marginBottom: "15px"
                        }}
                    >
                        👤 Suspects
                    </h3>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: "15px"
                        }}
                    >
                        {mysteryCase.suspects.map((suspect) => {
                            const isSelected =
                                selectedSuspect === suspect.name;

                            return (
                                <div
                                    key={suspect.name}
                                    onClick={() => {
                                        setSelectedSuspect(
                                            suspect.name
                                        );
                                        setInterrogationAnswer("");
                                    }}
                                    style={{
                                        padding: "20px",
                                        border: isSelected
                                            ? "2px solid #212529"
                                            : "1px solid #ddd",
                                        borderRadius: "12px",
                                        background: isSelected
                                            ? "#f1f3f5"
                                            : "#ffffff",
                                        boxShadow:
                                            "0 2px 8px rgba(0,0,0,0.08)",
                                        cursor: "pointer",
                                        transition: "0.2s"
                                    }}
                                >
                                    <h3
                                        style={{
                                            marginTop: 0,
                                            marginBottom: "10px"
                                        }}
                                    >
                                        👤 {suspect.name}
                                    </h3>

                                    <p
                                        style={{
                                            color: "#555",
                                            lineHeight: "1.6",
                                            marginBottom: 0
                                        }}
                                    >
                                        {suspect.description}
                                    </p>

                                    {isSelected && (
                                        <div
                                            style={{
                                                marginTop: "12px",
                                                fontWeight: "bold",
                                                color: "#212529"
                                            }}
                                        >
                                            ✓ Selected
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Clues */}
                    <h3
                        style={{
                            marginTop: "35px",
                            marginBottom: "15px"
                        }}
                    >
                        🔎 Clues
                    </h3>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: "15px"
                        }}
                    >
                        {mysteryCase.clues.map((clue, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: "20px",
                                    background: "#fffdf5",
                                    border: "1px solid #eadf9b",
                                    borderRadius: "12px",
                                    boxShadow:
                                        "0 2px 8px rgba(0,0,0,0.06)"
                                }}
                            >
                                <h4
                                    style={{
                                        marginTop: 0,
                                        marginBottom: "10px"
                                    }}
                                >
                                    🔍 Clue {index + 1}
                                </h4>

                                <p
                                    style={{
                                        margin: 0,
                                        color: "#555",
                                        lineHeight: "1.6"
                                    }}
                                >
                                    {clue}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Interrogation Section */}
                    <div
                        style={{
                            marginTop: "35px",
                            padding: "25px",
                            background: "#f8f9fa",
                            border: "1px solid #ddd",
                            borderRadius: "12px"
                        }}
                    >
                        <h3 style={{ marginTop: 0 }}>
                            🕵️ Interrogate a Suspect
                        </h3>

                        <p
                            style={{
                                color: "#666",
                                marginBottom: "20px"
                            }}
                        >
                            Select a suspect and ask a question
                            to gather information.
                        </p>

                        <select
                            value={selectedSuspect}
                            onChange={(e) => {
                                setSelectedSuspect(e.target.value);
                                setInterrogationAnswer("");
                            }}
                            style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                marginBottom: "15px",
                                fontSize: "15px",
                                background: "#fff",
                                boxSizing: "border-box"
                            }}
                        >
                            <option value="">
                                -- Select a suspect --
                            </option>

                            {mysteryCase.suspects.map(
                                (suspect) => (
                                    <option
                                        key={suspect.name}
                                        value={suspect.name}
                                    >
                                        {suspect.name}
                                    </option>
                                )
                            )}
                        </select>

                        <textarea
                            value={interrogationQuestion}
                            onChange={(e) =>
                                setInterrogationQuestion(
                                    e.target.value
                                )
                            }
                            placeholder="Ask the suspect a question..."
                            rows={4}
                            disabled={interrogating}
                            style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                resize: "vertical",
                                fontSize: "15px",
                                boxSizing: "border-box",
                                marginBottom: "15px"
                            }}
                        />

                        <button
                            onClick={handleInterrogation}
                            disabled={
                                interrogating ||
                                !selectedSuspect ||
                                !interrogationQuestion.trim()
                            }
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "none",
                                borderRadius: "8px",
                                background:
                                    interrogating ||
                                    !selectedSuspect ||
                                    !interrogationQuestion.trim()
                                        ? "#aaa"
                                        : "#212529",
                                color: "#fff",
                                fontSize: "16px",
                                fontWeight: "bold",
                                cursor:
                                    interrogating ||
                                    !selectedSuspect ||
                                    !interrogationQuestion.trim()
                                        ? "not-allowed"
                                        : "pointer"
                            }}
                        >
                            {interrogating
                                ? "⏳ Suspect is answering..."
                                : "💬 Ask Question"}
                        </button>
                    </div>

                    {/* Latest Answer */}
                    {interrogationAnswer && (
                        <div
                            style={{
                                marginTop: "25px",
                                padding: "20px",
                                background: "#eef6ff",
                                border: "1px solid #b8d8ff",
                                borderRadius: "12px"
                            }}
                        >
                            <h3
                                style={{
                                    marginTop: 0
                                }}
                            >
                                🗣️ Suspect's Answer
                            </h3>

                            <p
                                style={{
                                    marginBottom: 0,
                                    lineHeight: "1.7",
                                    color: "#444"
                                }}
                            >
                                {interrogationAnswer}
                            </p>
                        </div>
                    )}

                    {/* Interrogation History */}
                    {interrogationHistory.length > 0 && (
                        <div
                            style={{
                                marginTop: "35px"
                            }}
                        >
                            <h2>
                                📜 Interrogation History
                            </h2>

                            <p
                                style={{
                                    color: "#666"
                                }}
                            >
                                Review everything you discovered
                                during your investigation.
                            </p>

                            {interrogationHistory.map(
                                (interrogation, index) => (
                                    <div
                                        key={
                                            interrogation.id ||
                                            index
                                        }
                                        style={{
                                            marginBottom: "18px",
                                            padding: "20px",
                                            background: "#ffffff",
                                            border: "1px solid #ddd",
                                            borderRadius: "12px",
                                            boxShadow:
                                                "0 2px 8px rgba(0,0,0,0.06)"
                                        }}
                                    >
                                        <div
                                            style={{
                                                marginBottom: "12px",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            👤 {interrogation.suspect}
                                        </div>

                                        <div
                                            style={{
                                                padding: "12px",
                                                background: "#f8f9fa",
                                                borderRadius: "8px",
                                                marginBottom: "10px"
                                            }}
                                        >
                                            <strong>
                                                🕵️ You:
                                            </strong>

                                            <p
                                                style={{
                                                    marginBottom: 0,
                                                    marginTop: "6px",
                                                    lineHeight: "1.6"
                                                }}
                                            >
                                                {
                                                    interrogation.question
                                                }
                                            </p>
                                        </div>

                                        <div
                                            style={{
                                                padding: "12px",
                                                background: "#eef6ff",
                                                borderRadius: "8px"
                                            }}
                                        >
                                            <strong>
                                                🗣️ Suspect:
                                            </strong>

                                            <p
                                                style={{
                                                    marginBottom: 0,
                                                    marginTop: "6px",
                                                    lineHeight: "1.6"
                                                }}
                                            >
                                                {
                                                    interrogation.answer
                                                }
                                            </p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    {/* Final Accusation */}
                    <div
                        style={{
                            marginTop: "40px",
                            padding: "25px",
                            background: "#fff8f8",
                            border: "1px solid #e5b8b8",
                            borderRadius: "12px"
                        }}
                    >
                        <h2
                            style={{
                                marginTop: 0
                            }}
                        >
                            ⚖️ Final Accusation
                        </h2>

                        <p
                            style={{
                                color: "#666",
                                lineHeight: "1.6"
                            }}
                        >
                            Choose the suspect you believe is
                            responsible and submit your final
                            accusation.
                        </p>

                        <div
                            style={{
                                padding: "15px",
                                background: "#fff",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                marginBottom: "15px"
                            }}
                        >
                            <strong>
                                Selected Suspect:
                            </strong>

                            <span
                                style={{
                                    marginLeft: "8px"
                                }}
                            >
                                {selectedSuspect ||
                                    "No suspect selected"}
                            </span>
                        </div>

                        <button
                            onClick={handleAccusation}
                            disabled={!selectedSuspect}
                            style={{
                                width: "100%",
                                padding: "13px",
                                border: "none",
                                borderRadius: "8px",
                                background: !selectedSuspect
                                    ? "#aaa"
                                    : "#b02a37",
                                color: "#fff",
                                fontSize: "16px",
                                fontWeight: "bold",
                                cursor: !selectedSuspect
                                    ? "not-allowed"
                                    : "pointer"
                            }}
                        >
                            ⚖️ Submit Final Accusation
                        </button>

                        {result && (
                            <div
                                style={{
                                    marginTop: "20px",
                                    padding: "18px",
                                    background: "#fff",
                                    borderRadius: "10px",
                                    border: "1px solid #ddd"
                                }}
                            >
                                <h3
                                    style={{
                                        marginTop: 0
                                    }}
                                >
                                    📊 Investigation Result
                                </h3>

                                <p
                                    style={{
                                        marginBottom: 0,
                                        fontSize: "17px",
                                        lineHeight: "1.6"
                                    }}
                                >
                                    {result}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Bottom Navigation */}
                    <div
                        style={{
                            textAlign: "center",
                            marginTop: "35px",
                            paddingBottom: "30px"
                        }}
                    >
                        <button
                            onClick={() => navigate("/score")}
                            style={{
                                padding: "11px 20px",
                                border: "1px solid #6f42c1",
                                borderRadius: "8px",
                                background: "#fff",
                                color: "#6f42c1",
                                fontWeight: "bold",
                                cursor: "pointer"
                            }}
                        >
                            🏆 View My Detective Score
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Case;