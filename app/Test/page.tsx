// /app/quiz/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Quiz from "../component/quiz"; // Pastikan ini adalah komponen quiz Anda

const QuizPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(false); // Jika pengguna sudah login, tetap di halaman quiz
      } else {
        router.push("/login"); // Jika pengguna belum login, arahkan ke halaman login
      }
    });

    return () => unsubscribe(); // Bersihkan listener saat komponen di-unmount
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Quiz />
    </div>
  );
};

export default QuizPage;
