import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const generateMystery = async () => {
    const prompt = `
Create a completely original detective mystery case.

The case must be internally consistent.

IMPORTANT:
- The title, description, suspects, clues, and solution MUST all describe the SAME crime.
- Do not use a fixed crime such as diamond theft.
- The stolen/missing object or crime described in the title must match the description, clues, suspects, and solution.
- Every clue must be relevant to the same case.
- The solution must identify exactly one culprit from the listed suspects.
- The culprit's identity must be supported by the clues.
- Do not include information that contradicts the solution.
- Make the mystery solvable using the provided clues and suspect information.
- Keep the case suitable for an interactive detective game.

Return ONLY valid JSON.

Use exactly this structure:

{
  "title": "A short mystery title",
  "description": "A detailed description of the crime and investigation.",
  "difficulty": "Easy",
  "suspects": [
    {
      "name": "Suspect 1",
      "description": "Description of the suspect and their connection to the case."
    },
    {
      "name": "Suspect 2",
      "description": "Description of the suspect and their connection to the case."
    },
    {
      "name": "Suspect 3",
      "description": "Description of the suspect and their connection to the case."
    }
  ],
  "clues": [
    "Clue 1",
    "Clue 2",
    "Clue 3",
    "Clue 4",
    "Clue 5"
  ],
  "solution": "Clearly explain which suspect committed the crime and how the clues prove it."
}

Difficulty must be one of:
- Easy
- Medium
- Hard

Rules:
- Exactly 3 suspects.
- Provide 5 useful clues.
- Only one suspect should be the actual culprit.
- The other suspects should have believable motives or suspicious circumstances but must not be the culprit.
- The solution must match one of the three suspects exactly.
- Do not mention the solution outside the "solution" field.
`;

    const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
            {
                role: "system",
                content:
                    "You generate logically consistent detective mystery cases in JSON format.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.8,
    });

    const content = completion.choices[0].message.content;

    let mystery;

    try {
        mystery = JSON.parse(content);
    } catch (error) {
        console.error("Failed to parse AI mystery JSON:", error);
        console.error("AI response:", content);

        throw new Error("AI returned invalid mystery JSON");
    }

    // Basic validation
    if (
        !mystery.title ||
        !mystery.description ||
        !mystery.difficulty ||
        !Array.isArray(mystery.suspects) ||
        mystery.suspects.length !== 3 ||
        !Array.isArray(mystery.clues) ||
        mystery.clues.length < 3 ||
        !mystery.solution
    ) {
        throw new Error("AI generated an incomplete mystery case");
    }

    return mystery;
};

export default generateMystery;