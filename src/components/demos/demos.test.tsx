import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ModelVsInstanceDemo from "./model-vs-instance-demo";
import OnlineLearningDemo from "./online-learning-demo";
import OverfittingDemo from "./overfitting-demo";
import SupervisionTypesDemo from "./supervision-types-demo";

describe("interactive demos (smoke)", () => {
  it("supervision-types: switches to unsupervised and runs k-means until convergence", () => {
    render(<SupervisionTypesDemo />);
    fireEvent.click(screen.getByRole("radio", { name: "Nəzarətsiz" }));
    const step = screen.getByRole("button", { name: /k-means addımı/ });
    for (let i = 0; i < 30 && !(step as HTMLButtonElement).disabled; i++) fireEvent.click(step);
    expect(screen.getByText("Yığıldı ✓")).toBeInTheDocument();
  });

  it("online-learning: steps update the sample counter", () => {
    render(<OnlineLearningDemo />);
    const step = screen.getByRole("button", { name: /Addım/ });
    for (let i = 0; i < 5; i++) fireEvent.click(step);
    expect(screen.getByText("Görülən nümunə").nextSibling?.textContent).toBe("5");
  });

  it("online-learning: play runs on a timer and can be paused", () => {
    vi.useFakeTimers();
    render(<OnlineLearningDemo />);
    fireEvent.click(screen.getByRole("button", { name: /Başlat/ }));
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    fireEvent.click(screen.getByRole("button", { name: /Dayandır/ }));
    const seen = Number(screen.getByText("Görülən nümunə").nextSibling?.textContent);
    expect(seen).toBeGreaterThan(3);
    vi.useRealTimers();
  });

  it("model-vs-instance: k slider changes the k-NN label", () => {
    render(<ModelVsInstanceDemo />);
    fireEvent.change(screen.getByLabelText("Qonşu sayı (k)"), { target: { value: "7" } });
    expect(screen.getByText("7-NN proqnozu")).toBeInTheDocument();
  });

  it("overfitting: high degree without regularization is diagnosed as overfitting", () => {
    render(<OverfittingDemo />);
    fireEvent.change(screen.getByLabelText("Polinomun dərəcəsi"), { target: { value: "12" } });
    expect(screen.getByText("Overfitting")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Polinomun dərəcəsi"), { target: { value: "1" } });
    expect(screen.getByText("Underfitting")).toBeInTheDocument();
  });
});
