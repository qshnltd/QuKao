import React from "react";

export interface Question {
  id: string;
  text: string;
  type: "pilihan_ganda" | "esai";
  options?: string[]; // [A, B, C, D]
  correctAnswer?: string; // "A" | "B" | "C" | "D"
}

export interface QuizItem {
  id: string;
  title: string;
  questions: Question[];
  duration: string; // e.g., "15 Menit"
  done: boolean;
  score: number | null;
  type: "ujian" | "quiz" | "form";
  isDraft?: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
}

export interface MaterialItem {
  id: string;
  title: string;
  size: string;
  isPinned?: boolean;
  isArchived?: boolean;
}

export interface DiscussionItem {
  id: string;
  sender: string;
  text: string;
  date: string;
}

export interface ClassItem {
  id: string;
  name: string;
  code: string;
  teacher: string;
  bg: string;
  textColor: string;
  icon: string; // Icon identifier (e.g., "Hash", "Zap", "BookOpen", "GraduationCap")
  students: number;
  materials: MaterialItem[];
  quizzes: QuizItem[];
  discussions: DiscussionItem[];
  isPinned?: boolean;
  isArchived?: boolean;
}

export interface EssayAnswer {
  questionId: string;
  questionText: string;
  studentAnswer: string;
  score: number | null; // teacher graded
}

export interface Submission {
  id: string;
  classId: string;
  className: string;
  quizId: string;
  quizTitle: string;
  studentName: string;
  studentEmail: string;
  submitDate: string;
  scoreMc: number; // MC auto-score (0-100)
  scoreEssay: number | null; // Graded essay score
  finalScore: number | null; // Combined score
  essayAnswers: EssayAnswer[];
  status: "perlu_koreksi" | "selesai";
}
