import type { Question } from "@/lib/schemas";

export type Answer = string[] | boolean | null;

export function isAnswered(answer: Answer): boolean {
  if (answer === null) return false;
  if (typeof answer === "boolean") return true;
  return answer.length > 0;
}

/** Exact-match grading: multiple choice requires the full set of correct options and nothing else. */
export function isCorrect(question: Question, answer: Answer): boolean {
  switch (question.type) {
    case "true-false":
      return answer === question.answer;
    case "single-choice":
      return Array.isArray(answer) && answer.length === 1 && answer[0] === question.correctOptionId;
    case "multiple-choice": {
      if (!Array.isArray(answer)) return false;
      const expected = new Set(question.correctOptionIds);
      return answer.length === expected.size && answer.every((a) => expected.has(a));
    }
  }
}

export function scoreQuiz(questions: readonly Question[], answers: readonly Answer[]): number {
  if (questions.length === 0) return 0;
  const correct = questions.filter((q, i) => isCorrect(q, answers[i] ?? null)).length;
  return correct / questions.length;
}
