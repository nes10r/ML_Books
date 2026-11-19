"use client";

import { CheckCircle2, RotateCcw, Trophy, XCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { t } from "@/lib/i18n/az";
import { useQuizProgress } from "@/lib/progress/hooks";
import { useProgressStore } from "@/lib/progress/store";
import type { Question, Quiz } from "@/lib/schemas";
import { cn, formatPercent } from "@/lib/utils";
import { isAnswered, isCorrect, scoreQuiz, type Answer } from "./quiz-logic";

type Phase = "answering" | "checked" | "finished";

/** Step-by-step quiz with immediate feedback and explanations. Attempts are stored in local progress. */
export function QuizPlayer({ quiz, compact = false }: { quiz: Quiz; compact?: boolean }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(() => quiz.questions.map(() => null));
  const [phase, setPhase] = useState<Phase>("answering");
  const record = useProgressStore((s) => s.recordQuizAttempt);
  const { hydrated, quiz: stored } = useQuizProgress(quiz.id);

  const question = quiz.questions[index];
  const total = quiz.questions.length;
  if (!question) return null;
  const answer = answers[index] ?? null;

  const setAnswer = (a: Answer) => setAnswers((prev) => prev.map((x, i) => (i === index ? a : x)));

  const onPrimary = () => {
    if (phase === "answering") {
      setPhase("checked");
    } else if (phase === "checked") {
      if (index + 1 < total) {
        setIndex(index + 1);
        setPhase("answering");
      } else {
        record(quiz.id, scoreQuiz(quiz.questions, answers));
        setPhase("finished");
      }
    }
  };

  const restart = () => {
    setAnswers(quiz.questions.map(() => null));
    setIndex(0);
    setPhase("answering");
  };

  if (phase === "finished") {
    const score = scoreQuiz(quiz.questions, answers);
    const passed = score >= quiz.passingScore;
    return (
      <div className="rounded-xl border bg-surface p-6 text-center" role="status">
        <div className={cn("mx-auto mb-3 grid size-12 place-items-center rounded-full", passed ? "bg-success-soft text-success" : "bg-warning-soft")}>
          {passed ? <Trophy className="size-6" aria-hidden /> : <RotateCcw className="size-6" aria-hidden />}
        </div>
        <p className="text-sm text-muted-foreground">{t.quiz.score}</p>
        <p className="text-3xl font-semibold tabular-nums">{formatPercent(score)}</p>
        <p className="mx-auto mt-2 max-w-md text-sm">{passed ? t.quiz.passed : t.quiz.failed}</p>
        {hydrated && stored && (
          <p className="mt-2 text-xs text-muted-foreground">
            {t.quiz.best}: {formatPercent(stored.bestScore)} · {t.quiz.attempts}: {stored.attempts}
          </p>
        )}
        <Button variant="outline" className="mt-4" onClick={restart}>
          <RotateCcw />
          {t.quiz.retry}
        </Button>
      </div>
    );
  }

  const checked = phase === "checked";
  const correct = checked && isCorrect(question, answer);

  return (
    <div className={cn("rounded-xl border bg-surface", compact ? "p-4 sm:p-5" : "p-5 sm:p-6")}>
      <div className="mb-4 flex items-center gap-3">
        <span className="text-xs font-medium text-muted-foreground tabular-nums">
          {t.quiz.question} {index + 1} {t.quiz.of} {total}
        </span>
        <Progress value={((index + (checked ? 1 : 0)) / total) * 100} className="h-1.5 flex-1" aria-hidden />
      </div>
      <fieldset>
        <legend className="mb-1 font-medium leading-relaxed">{question.prompt}</legend>
        <p className="mb-3 text-xs text-muted-foreground">
          {question.type === "multiple-choice" ? t.quiz.selectMany : t.quiz.selectOne}
        </p>
        <QuestionOptions question={question} answer={answer} onChange={setAnswer} disabled={checked} />
      </fieldset>

      {checked && (
        <div
          role="status"
          className={cn(
            "mt-4 rounded-lg border p-4 text-sm",
            correct ? "border-success/30 bg-success-soft/60" : "border-danger/30 bg-danger-soft/60",
          )}
        >
          <p className={cn("mb-1 flex items-center gap-1.5 font-semibold", correct ? "text-success" : "text-danger")}>
            {correct ? <CheckCircle2 className="size-4" aria-hidden /> : <XCircle className="size-4" aria-hidden />}
            {correct ? t.quiz.correct : t.quiz.incorrect}
          </p>
          <p className="leading-relaxed">{question.explanation}</p>
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <Button onClick={onPrimary} disabled={!checked && !isAnswered(answer)}>
          {!checked ? t.quiz.check : index + 1 < total ? t.quiz.next : t.quiz.finish}
        </Button>
      </div>
    </div>
  );
}

function QuestionOptions({
  question,
  answer,
  onChange,
  disabled,
}: {
  question: Question;
  answer: Answer;
  onChange: (a: Answer) => void;
  disabled: boolean;
}) {
  const name = `q-${question.id}`;
  if (question.type === "true-false") {
    const opts = [
      { value: true, label: t.quiz.trueLabel },
      { value: false, label: t.quiz.falseLabel },
    ];
    return (
      <div className="grid grid-cols-2 gap-2">
        {opts.map((o) => (
          <OptionRow
            key={String(o.value)}
            type="radio"
            name={name}
            label={o.label}
            checked={answer === o.value}
            onChange={() => onChange(o.value)}
            disabled={disabled}
            state={disabled ? (question.answer === o.value ? "correct" : answer === o.value ? "wrong" : undefined) : undefined}
          />
        ))}
      </div>
    );
  }
  const selected = Array.isArray(answer) ? answer : [];
  const correctIds = question.type === "single-choice" ? [question.correctOptionId] : question.correctOptionIds;
  return (
    <div className="space-y-2">
      {question.options.map((o) => {
        const isSel = selected.includes(o.id);
        return (
          <OptionRow
            key={o.id}
            type={question.type === "single-choice" ? "radio" : "checkbox"}
            name={name}
            label={o.text}
            checked={isSel}
            disabled={disabled}
            onChange={() => {
              if (question.type === "single-choice") onChange([o.id]);
              else onChange(isSel ? selected.filter((s) => s !== o.id) : [...selected, o.id]);
            }}
            state={disabled ? (correctIds.includes(o.id) ? "correct" : isSel ? "wrong" : undefined) : undefined}
          />
        );
      })}
    </div>
  );
}

function OptionRow({
  type,
  name,
  label,
  checked,
  onChange,
  disabled,
  state,
}: {
  type: "radio" | "checkbox";
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  disabled: boolean;
  state?: "correct" | "wrong";
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-3 text-sm transition-colors",
        !disabled && "hover:border-primary/40 hover:bg-surface-muted/50",
        checked && !state && "border-primary bg-primary-soft/50",
        state === "correct" && "border-success/50 bg-success-soft/50",
        state === "wrong" && "border-danger/50 bg-danger-soft/50",
        disabled && "cursor-default",
      )}
    >
      <input type={type} name={name} checked={checked} onChange={onChange} disabled={disabled} className="mt-0.5 accent-[var(--primary)]" />
      <span className="flex-1 leading-relaxed">{label}</span>
      {state === "correct" && <CheckCircle2 className="size-4 shrink-0 text-success" aria-label={t.quiz.correct} />}
      {state === "wrong" && <XCircle className="size-4 shrink-0 text-danger" aria-label={t.quiz.incorrect} />}
    </label>
  );
}
