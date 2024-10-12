"Use Client"

import React from "react";

interface QuestionProps {
  questionData: {
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
  };
  selectedOption: string | null;
  handleOptionChange: (option: string) => void;
}

const Question: React.FC<QuestionProps> = ({
  questionData,
  selectedOption,
  handleOptionChange,
}) => {
  const shuffledOptions = [
    questionData.correct_answer,
    ...questionData.incorrect_answers,
  ].sort(() => Math.random() - 0);

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-4 text-black">
        {questionData.question}
      </h2>
      <div className="space-y-2">
        {shuffledOptions.map((option, index) => (
          <div key={index} className="flex items-center text-black">
            <input
              type="radio"
              id={option}
              name="quiz"
              value={option}
              checked={selectedOption === option}
              onChange={() => handleOptionChange(option)}
              className="mr-2"
            />
            <label htmlFor={option}>{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;
