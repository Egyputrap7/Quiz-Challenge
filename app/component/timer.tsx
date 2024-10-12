// Timer.tsx
import React, { useState, useEffect } from "react";

interface TimerProps {
  onTimeOver: () => void;
}

const Timer: React.FC<TimerProps> = ({ onTimeOver }) => {
  const initialTime = 300; // Set timer for 5 minutes (300 seconds)
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const startTime = localStorage.getItem("quizStartTime");
    
    // Jika startTime ada, hitung sisa waktu
    if (startTime) {
      const elapsed = Math.floor((Date.now() - parseInt(startTime)) / 1000); // Hitung waktu yang telah berlalu
      const newTimeLeft = initialTime - elapsed; // Kurangi dari total waktu
      setTimeLeft(newTimeLeft > 0 ? newTimeLeft : 0); // Pastikan tidak negatif
    } else {
      // Jika tidak ada startTime, simpan waktu mulai sekarang
      localStorage.setItem("quizStartTime", Date.now().toString());
      setTimeLeft(initialTime);
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          onTimeOver();
          clearInterval(timer);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialTime, onTimeOver]);

  return (
    <div className="mb-4 p-2 bg-red-100 rounded">
      <h3 className="text-red-500 font-bold">
        Time left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? "0" : ""}
        {timeLeft % 60} minutes
      </h3>
    </div>
  );
};

export default Timer;
