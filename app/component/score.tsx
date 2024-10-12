import React from "react";

interface ScoreProps {
  questions: {
    correct_answer: string;
    incorrect_answers: string[];
  }[];
  answers: { [key: number]: string };
}

const Score: React.FC<ScoreProps> = ({ questions, answers }) => {
  // Hitung skor dan jumlah jawaban yang salah
  const { correctCount, incorrectCount } = questions.reduce(
    (acc, question, index) => {
      if (answers[index] === question.correct_answer) {
        acc.correctCount += 1; // Jika jawaban benar
      } else if (answers[index]) {
        acc.incorrectCount += 1; // Jika ada jawaban, tapi salah
      }
      return acc;
    },
    { correctCount: 0, incorrectCount: 0 } // Inisialisasi
  );

  return (
    <div className="w-full text-black max-w-lg p-6 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
      <p className="text-lg mb-4">
        You scored {correctCount} out of {questions.length}
      </p>
      <p className="text-lg mb-4">
        Incorrect answers: {incorrectCount}
      </p>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => window.location.reload()}
      >
        Restart Quiz
      </button>
    </div>
  );
};

export default Score;
