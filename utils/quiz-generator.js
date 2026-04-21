const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Generate quiz questions from YouTube video
async function generateQuiz(videoTitle, videoDescription, videoTranscript) {
    const prompt = `
You are an educational quiz generator. Based on the following video content, create 5 multiple-choice questions to test understanding.

Video Title: ${videoTitle}
Video Description: ${videoDescription}
Video Transcript Summary: ${videoTranscript || 'No transcript available. Use the title and description only.'}

Generate exactly 5 multiple-choice questions. Each question must have:
- The question text
- 4 possible answers (A, B, C, D)
- The correct answer letter
- A brief explanation of why it's correct

Format your response as JSON:
{
  "questions": [
    {
      "question": "What is the main topic of this lesson?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "A",
      "explanation": "Because this is the key concept explained in the video."
    }
  ]
}

Make questions that test REAL understanding, not trivial details. Focus on:
- Key concepts
- Practical applications
- Important definitions
- Common mistakes to avoid
`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        
        // Parse JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const quizData = JSON.parse(jsonMatch[0]);
            return quizData.questions;
        }
        throw new Error('Failed to parse quiz data');
    } catch (error) {
        console.error('Quiz generation error:', error);
        // Return fallback questions
        return getFallbackQuestions(videoTitle);
    }
}

// Fallback questions if AI fails
function getFallbackQuestions(videoTitle) {
    return [
        {
            question: `What is the main topic of "${videoTitle}"?`,
            options: ["Understanding the core concept", "Advanced techniques", "Basic introduction", "Practical applications"],
            correct_answer: "A",
            explanation: "The video focuses on explaining the core concept."
        },
        {
            question: "Which of the following is most important to remember from this lesson?",
            options: ["Key takeaway 1", "Key takeaway 2", "Key takeaway 3", "Key takeaway 4"],
            correct_answer: "A",
            explanation: "The primary key takeaway is the most important concept."
        },
        {
            question: "How would you apply what you learned in this lesson?",
            options: ["Practice regularly", "Watch more videos", "Take notes", "Ask questions"],
            correct_answer: "A",
            explanation: "Regular practice reinforces learning."
        }
    ];
}

// Generate quiz from lesson data only (no transcript)
async function generateQuizFromMetadata(title, description) {
    return generateQuiz(title, description, null);
}

module.exports = { generateQuiz, generateQuizFromMetadata };
