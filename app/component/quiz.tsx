// Quiz.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Question from "./question";
import Timer from "./timer";
import Score from "./score";

interface QuestionType {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  options: string[];
}

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const fetchQuestionsWithRetry = async (retryCount = 3): Promise<QuestionType[]> => {
  try {
    const response = await axios.get("https://opentdb.com/api.php?amount=10");
    return shuffleArray(response.data.results);
  } catch (error: any) {
    if (error.response && error.response.status === 429 && retryCount > 0) {
      console.log(`Rate limit hit, retrying in 3 seconds... (Remaining retries: ${retryCount})`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return fetchQuestionsWithRetry(retryCount - 1);
    } else {
      throw error;
    }
  }
};

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [timeOver, setTimeOver] = useState(false);

  useEffect(() => {
    const fetchQuestionsData = async () => {
      const cachedQuestions = localStorage.getItem("quizQuestions");
      if (cachedQuestions) {
        setQuestions(JSON.parse(cachedQuestions));
        setLoading(false);
      } else {
        try {
          const questionsData = await fetchQuestionsWithRetry();
          setQuestions(questionsData);
          localStorage.setItem("quizQuestions", JSON.stringify(questionsData));
          setLoading(false);
        } catch (error) {
          console.error("Error fetching questions:", error);
        }
      }
    };

    fetchQuestionsData();
  }, []);

  const handleCompleteQuiz = () => {
    setIsQuizCompleted(true);
    localStorage.removeItem("quizStartTime"); // Hapus waktu mulai dari localStorage ketika quiz selesai
  };

  const handleTimeOver = () => {
    setTimeOver(true);
    setIsQuizCompleted(true);
    localStorage.removeItem("quizStartTime"); // Hapus waktu mulai dari localStorage
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(answers[currentQuestionIndex + 1] || null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(answers[currentQuestionIndex - 1] || null);
    }
  };

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    setAnswers({ ...answers, [currentQuestionIndex]: option });
  };
  const handleDirectQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
    setSelectedOption(answers[index] || null);
  };

 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isQuizCompleted) {
    return <Score questions={questions} answers={answers} />;
  }

  return (
    <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md">
      <Timer onTimeOver={handleTimeOver} /> {/* Memanggil komponen Timer */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-black">
          Question {currentQuestionIndex + 1}/{questions.length}
        </h2>
      </div>
      {questions[currentQuestionIndex] ? (
        <Question
          questionData={questions[currentQuestionIndex]}
          selectedOption={selectedOption}
          handleOptionChange={handleOptionChange}
        />
      ) : (
        <div>Question data not available.</div>
      )}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Next
        </button>
        <button
          onClick={handleCompleteQuiz}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Finish Quiz
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-black">Question Tracker</h3>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`p-2 border rounded ${
                answers[index] ? "bg-green-500 text-white" : "bg-gray-300 text-black"
              }`}
              onClick={() => handleDirectQuestionSelect(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
