'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Question {
    id: string;
    question_text: string;
    options: string[];
    correct_answer: string;
    explanation?: string;
}

interface QuizProps {
    quizId: string;
    title: string;
    questions: Question[];
    onComplete: (score: number, passed: boolean, answers: Record<string, string>) => void;
    passingScore?: number;
}

export function QuizRunner({ quizId, title, questions, onComplete, passingScore = 70 }: QuizProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedOption === currentQuestion?.correct_answer;

    // Clay styles
    const clayCard = "bg-white/80 backdrop-blur-md rounded-3xl shadow-[8px_8px_16px_#b8b9be,-8px_-8px_16px_#ffffff] border border-white/40 p-8";
    const clayButton = "relative w-full p-4 rounded-xl font-bold text-lg transition-all active:scale-95 shadow-[5px_5px_10px_#b8b9be,-5px_-5px_10px_#ffffff] hover:shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] hover:-translate-y-1";

    // Green Clay (Correct)
    const claySuccess = "bg-green-100 text-green-700 border-2 border-green-400 shadow-[inset_2px_2px_5px_rgba(34,197,94,0.2)]";
    // Red Clay (Incorrect)
    const clayError = "bg-red-100 text-red-700 border-2 border-red-400 shadow-[inset_2px_2px_5px_rgba(239,68,68,0.2)]";
    // Neutral Clay
    const clayNeutral = "bg-white text-slate-700 border border-white/60";

    const handleAnswer = (option: string) => {
        if (isAnswered) return;

        setSelectedOption(option);
        setIsAnswered(true);
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));

        if (option === currentQuestion.correct_answer) {
            setScore(prev => prev + 1);
            confetti({
                particleCount: 30,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#22c55e', '#86efac']
            });
        } else {
            // Shake effect?
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        const finalPercentage = Math.round(((score + (isCorrect ? 0 : 0)) / questions.length) * 100); // Check logic: score already updated? Yes, handleAnswer updates it.
        // Wait, handleNext calls finishQuiz. And handleNext is clicked AFTER answering. So score is correct.

        setShowResults(true);
        const passed = finalPercentage >= passingScore;

        if (passed) {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 }
            });
        }

        onComplete(finalPercentage, passed, answers);
    };

    if (showResults) {
        const percentage = Math.round((score / questions.length) * 100);
        const passed = percentage >= passingScore;

        return (
            <div className={`${clayCard} text-center flex flex-col items-center justify-center min-h-[400px]`}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-xl ${passed ? 'bg-green-100 ring-4 ring-green-200' : 'bg-orange-100 ring-4 ring-orange-200'}`}
                >
                    {passed ? <Trophy className="w-16 h-16 text-green-600" /> : <RotateCcw className="w-16 h-16 text-orange-600" />}
                </motion.div>

                <h2 className="text-3xl font-[Baloo_2] font-bold text-slate-800 mb-2">
                    {passed ? 'Tuyệt vời!' : 'Cố gắng lên!'}
                </h2>

                <p className="text-slate-500 mb-8 font-[Quicksand]">
                    Bạn đạt <span className={`font-bold text-xl ${passed ? 'text-green-600' : 'text-orange-600'}`}>{percentage}%</span> số điểm
                </p>

                <div className="flex gap-4">
                    {!passed && (
                        <button
                            onClick={() => window.location.reload()}
                            className={`${clayButton} bg-orange-500 text-white !w-auto px-8 py-3`}
                        >
                            Làm lại
                        </button>
                    )}
                    {passed && (
                        <button className={`${clayButton} bg-indigo-500 text-white !w-auto px-8 py-3 shadow-indigo-300`}>
                            Tiếp tục
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`${clayCard} max-w-2xl mx-auto`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-[Baloo_2] font-bold text-indigo-900">{title}</h2>
                    <p className="text-sm text-slate-400 font-bold">Câu hỏi {currentIndex + 1} / {questions.length}</p>
                </div>
                <div className="flex gap-1">
                    {questions.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-2 w-8 rounded-full transition-colors ${idx < currentIndex ? 'bg-indigo-500' :
                                idx === currentIndex ? 'bg-indigo-300' : 'bg-slate-100'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Question */}
            <div className="mb-8 min-h-[100px]">
                <h3 className="text-xl font-bold text-slate-700 font-[Quicksand]">
                    {currentQuestion.question_text}
                </h3>
            </div>

            {/* Options */}
            <div className="space-y-4 mb-8">
                <AnimatePresence mode='wait'>
                    {currentQuestion.options.map((option, idx) => {
                        let stateStyle = clayNeutral;
                        const isSelected = selectedOption === option;

                        if (isAnswered) {
                            if (option === currentQuestion.correct_answer) stateStyle = claySuccess;
                            else if (isSelected) stateStyle = clayError;
                            else stateStyle = "opacity-50 grayscale";
                        }

                        return (
                            <motion.button
                                key={`${currentQuestion.id}-${idx}`}
                                onClick={() => handleAnswer(option)}
                                disabled={isAnswered}
                                className={`${clayButton} ${stateStyle} flex items-center justify-between group`}
                                whileHover={!isAnswered ? { scale: 1.02 } : {}}
                                whileTap={!isAnswered ? { scale: 0.98 } : {}}
                            >
                                <span>{option}</span>
                                {isAnswered && option === currentQuestion.correct_answer && (
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                )}
                                {isAnswered && isSelected && option !== currentQuestion.correct_answer && (
                                    <XCircle className="w-6 h-6 text-red-600" />
                                )}
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Footer / Feedback */}
            <div className="h-16 flex items-center justify-end">
                {isAnswered && (
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={handleNext}
                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all text-lg"
                    >
                        {currentIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành'}
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                )}
            </div>
        </div>
    );
}
