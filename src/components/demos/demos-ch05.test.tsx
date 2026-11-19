import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RegressionTreeDemo from "./regression-tree-demo";
import SplitFinderDemo from "./split-finder-demo";
import TreeBuilderDemo from "./tree-builder-demo";
import TreeInstabilityDemo from "./tree-instability-demo";
import TreeRegularizationDemo from "./tree-regularization-demo";

const statValue = (label: string) => screen.getByText(label, { selector: "p" }).nextSibling!.textContent!;

describe("chapter 5 demos (smoke)", () => {
  it("tree builder: depth-2 tree classifies (7 cm, 120 g) as apple and highlights the path", () => {
    render(<TreeBuilderDemo />);
    expect(screen.getByText(/Proqnoz:/).textContent).toContain("alma");
    expect(statValue("Dərinlik")).toBe("2");
    expect(screen.getByRole("list", { name: "Qərar ağacı" })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("max_depth"), { target: { value: "6" } });
    expect(Number(statValue("Yarpaq"))).toBeGreaterThan(4);
  });

  it("split finder: jumping to the best threshold minimises weighted Gini", () => {
    render(<SplitFinderDemo />);
    const before = Number(statValue("Çəkili Gini"));
    fireEvent.click(screen.getByRole("button", { name: /Ən yaxşı həddə keç/ }));
    expect(Number(statValue("Çəkili Gini"))).toBeLessThanOrEqual(before);
  });

  it("tree regularization: unrestricted tree is 100% on training data; min_samples_leaf lowers it", () => {
    render(<TreeRegularizationDemo />);
    expect(statValue("Təlim dəqiqliyi")).toBe("100.0%");
    fireEvent.change(screen.getByLabelText("min_samples_leaf"), { target: { value: "8" } });
    expect(statValue("Təlim dəqiqliyi")).not.toBe("100.0%");
    expect(statValue("Yarpaq")).toBe("12");
  });

  it("regression tree: unrestricted tree has zero training RMSE", () => {
    render(<RegressionTreeDemo />);
    expect(statValue("Yarpaq")).toBe("4");
    fireEvent.change(screen.getByLabelText("max_depth"), { target: { value: "13" } });
    expect(statValue("Təlim RMSE")).toBe("0.00");
  });

  it("instability: rotation increases leaves; resampling changes the tree", () => {
    render(<TreeInstabilityDemo />);
    expect(statValue("Yarpaq")).toBe("2");
    fireEvent.change(screen.getByLabelText("Sərhədin bucağı"), { target: { value: "45" } });
    expect(statValue("Yarpaq")).toBe("18");
    fireEvent.click(screen.getByRole("radio", { name: "Yüksək dispersiya" }));
    const first = statValue("Kök bölgüsü") + statValue("Yarpaq");
    fireEvent.click(screen.getByRole("button", { name: /Başqa 80%/ }));
    fireEvent.click(screen.getByRole("button", { name: /Başqa 80%/ }));
    expect(Number(statValue("Fərqli sahə").replace("%", ""))).toBeGreaterThan(0);
    expect(first.length).toBeGreaterThan(0);
  });
});
