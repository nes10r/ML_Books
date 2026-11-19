import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import GdVariantsDemo from "./gd-variants-demo";
import GradientDescentDemo from "./gradient-descent-demo";
import LearningCurvesDemo from "./learning-curves-demo";
import LogisticBoundaryDemo from "./logistic-boundary-demo";
import RegularizationPathsDemo from "./regularization-paths-demo";

const statValue = (label: string) => screen.getByText(label, { selector: "p" }).nextSibling!.textContent!;

/** Animations chain one timeout per rendered step, so advance step by step inside act(). */
function advance(ticks: number, ms: number) {
  for (let i = 0; i < ticks; i++) {
    act(() => {
      vi.advanceTimersByTime(ms);
    });
  }
}

describe("chapter 4 demos (smoke)", () => {
  it("gradient descent: scaled feature with η = 0.1 reaches the minimum", () => {
    vi.useFakeTimers();
    render(<GradientDescentDemo />);
    fireEvent.click(screen.getByLabelText(/Əlaməti standartlaşdır/));
    fireEvent.change(screen.getByLabelText("Öyrənmə sürəti (η)"), { target: { value: "-1" } });
    fireEvent.click(screen.getByRole("button", { name: /Başlat/ }));
    advance(60, 60); // error shrinks ≈0.8² per step → minimum after ~22 steps
    expect(screen.getByText("Minimuma çatdıq (×).")).toBeInTheDocument();
    vi.useRealTimers();
  }, 20000);

  it("gradient descent: η too large on the unscaled feature diverges", () => {
    vi.useFakeTimers();
    render(<GradientDescentDemo />);
    fireEvent.change(screen.getByLabelText("Öyrənmə sürəti (η)"), { target: { value: "-1" } });
    fireEvent.click(screen.getByRole("button", { name: /Başlat/ }));
    advance(40, 60);
    expect(screen.getByText(/Öyrənmə sürəti çox böyükdür/)).toBeInTheDocument();
    vi.useRealTimers();
  }, 20000);

  it("GD variants: one epoch = 1 / 7 / 50 updates", () => {
    render(<GdVariantsDemo />);
    fireEvent.change(screen.getByLabelText("Epoxa sayı"), { target: { value: "1" } });
    expect(statValue("Paket (m = 50): yeniləmə")).toBe("1");
    expect(statValue("Mini-paket (8): yeniləmə")).toBe("7");
    expect(statValue("Stoxastik (1): yeniləmə")).toBe("50");
  });

  it("learning curves: degree 1 underfits, degree 2 fits well", () => {
    render(<LearningCurvesDemo />);
    expect(screen.getByText(/^Underfitting/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Polinomun dərəcəsi"), { target: { value: "2" } });
    expect(screen.getByText(/^Yaxşı uyğunluq/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Polinomun dərəcəsi"), { target: { value: "10" } });
    expect(screen.getByText(/^Overfitting/)).toBeInTheDocument();
  });

  it("regularization paths: lasso zeroes the 4 useless coefficients, ridge none", () => {
    render(<RegularizationPathsDemo />);
    expect(statValue("Sıfır əmsal")).toBe("4 / 8");
    fireEvent.click(screen.getByRole("radio", { name: "Ridge (ℓ₂)" }));
    expect(statValue("Sıfır əmsal")).toBe("0 / 8");
  });

  it("logistic boundary: starts at log loss ln 2 and improves when trained", () => {
    vi.useFakeTimers();
    render(<LogisticBoundaryDemo />);
    expect(statValue("Log itki")).toBe("0.693");
    fireEvent.click(screen.getByRole("button", { name: /Öyrət/ }));
    advance(3, 50); // 10 GD iterations per tick; ~10 iterations already bring log loss to ≈0.43
    expect(Number(statValue("Log itki"))).toBeLessThan(0.45);
    expect(Number(statValue("İterasiya"))).toBeGreaterThan(0);
    vi.useRealTimers();
  }, 20000);
});
