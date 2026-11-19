import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useProgressStore } from "@/lib/progress/store";
import { createEmptyProgress, quizSchema, type Question } from "@/lib/schemas";
import { isCorrect, scoreQuiz } from "./quiz-logic";
import { QuizPlayer } from "./quiz-player";

const single: Question = {
  id: "q1",
  type: "single-choice",
  prompt: "Hansı nəzarətli öyrənmədir?",
  explanation: "Etiketlər var.",
  options: [
    { id: "a", text: "Təsnifat" },
    { id: "b", text: "Klasterləşdirmə" },
  ],
  correctOptionId: "a",
};
const multi: Question = {
  id: "q2",
  type: "multiple-choice",
  prompt: "Hansılar?",
  explanation: "İzah mətni.",
  options: [
    { id: "a", text: "A" },
    { id: "b", text: "B" },
    { id: "c", text: "C" },
  ],
  correctOptionIds: ["a", "c"],
};
const tf: Question = { id: "q3", type: "true-false", prompt: "Doğrudur?", explanation: "Bəli.", answer: true };

describe("quiz logic", () => {
  it("grades each question type with exact matching", () => {
    expect(isCorrect(single, ["a"])).toBe(true);
    expect(isCorrect(single, ["b"])).toBe(false);
    expect(isCorrect(multi, ["c", "a"])).toBe(true);
    expect(isCorrect(multi, ["a"])).toBe(false);
    expect(isCorrect(multi, ["a", "b", "c"])).toBe(false);
    expect(isCorrect(tf, true)).toBe(true);
    expect(isCorrect(tf, null)).toBe(false);
  });
  it("scores a quiz", () => {
    expect(scoreQuiz([single, multi, tf], [["a"], ["a"], true])).toBeCloseTo(2 / 3);
  });
});

describe("<QuizPlayer />", () => {
  beforeEach(() => {
    useProgressStore.setState({ progress: createEmptyProgress(), hydrated: true });
  });

  it("checks answers, shows explanations and records the attempt", () => {
    const quiz = quizSchema.parse({ id: "t.quiz", title: "Test", description: "Test quiz.", chapterId: "ch01", questions: [single, tf] });
    render(<QuizPlayer quiz={quiz} />);

    const check = screen.getByRole("button", { name: "Cavabı yoxla" });
    expect(check).toBeDisabled();
    fireEvent.click(screen.getByLabelText("Təsnifat"));
    fireEvent.click(check);
    expect(screen.getByText("Düzgündür!")).toBeInTheDocument();
    expect(screen.getByText("Etiketlər var.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Növbəti sual" }));
    fireEvent.click(screen.getByLabelText("Yanlış"));
    fireEvent.click(screen.getByRole("button", { name: "Cavabı yoxla" }));
    expect(screen.getByText("Düzgün deyil")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Nəticəni gör" }));

    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(useProgressStore.getState().progress.quizzes["t.quiz"]).toMatchObject({ attempts: 1, bestScore: 0.5 });
  });
});
