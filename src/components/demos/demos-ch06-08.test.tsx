import { readFileSync } from "node:fs";
import path from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearCsvCache } from "@/lib/data/use-dataset";
import BaggingForestDemo from "./bagging-forest-demo";
import CurseDimensionalityDemo from "./curse-dimensionality-demo";
import DbscanDemo from "./dbscan-demo";
import GmmAnomalyDemo from "./gmm-anomaly-demo";
import GradientBoostingDemo from "./gradient-boosting-demo";
import KmeansElbowDemo from "./kmeans-elbow-demo";
import KmeansStepsDemo from "./kmeans-steps-demo";
import PcaCompressionDemo from "./pca-compression-demo";
import PcaProjectionDemo from "./pca-projection-demo";
import VotingWisdomDemo from "./voting-wisdom-demo";

const statValue = (label: string) => screen.getByText(label, { selector: "p" }).nextSibling!.textContent!;
const pctValue = (label: string) => parseFloat(statValue(label));
const slide = (label: string | RegExp, value: number) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value: String(value) } });

describe("chapter 6 demos (smoke)", () => {
  it("voting: independent voters beat correlated ones", () => {
    render(<VotingWisdomDemo />);
    expect(pctValue("Müstəqil")).toBeGreaterThan(pctValue("Korrelyasiyalı"));
  });

  it("bagging forest: 100-tree ensemble beats a single tree; modes switch", () => {
    render(<BaggingForestDemo />);
    slide("Ağac sayı", 100);
    expect(pctValue("100 ağac (test)")).toBeGreaterThan(pctValue("Tək ağac (test)"));
    expect(pctValue("OOB (100 ağac)")).toBeGreaterThan(80);
    fireEvent.click(screen.getByRole("radio", { name: "Extra-Trees" }));
    expect(pctValue("100 ağac (test)")).toBeGreaterThan(80);
  }, 20000);

  it("gradient boosting: training RMSE falls as stages are added", () => {
    render(<GradientBoostingDemo />);
    slide("Ağac sayı (mərhələ)", 1);
    const early = Number(statValue("Təlim RMSE"));
    slide("Ağac sayı (mərhələ)", 100);
    expect(Number(statValue("Təlim RMSE"))).toBeLessThan(early);
  }, 20000);
});

describe("chapter 7 demos (smoke)", () => {
  it("curse of dimensionality: more dimensions push points to the edge", () => {
    render(<CurseDimensionalityDemo />);
    slide("Ölçü sayı (d)", 2);
    const low = pctValue("Kənara yaxın");
    slide("Ölçü sayı (d)", 100);
    expect(pctValue("Kənara yaxın")).toBeGreaterThan(low);
  });

  it("PCA projection: the PC1 angle maximises projected variance", () => {
    render(<PcaProjectionDemo />);
    const pc = Math.round(parseFloat(statValue("PC1 bucağı")));
    slide("Oxun bucağı", (pc + 90) % 180);
    const orth = Number(statValue("Proyeksiyanın dispersiyası"));
    slide("Oxun bucağı", pc);
    expect(Number(statValue("Proyeksiyanın dispersiyası"))).toBeGreaterThan(orth);
  });

  describe("PCA compression (real digits dataset)", () => {
    const csv = readFileSync(path.join(process.cwd(), "public/data/digits-8x8.csv"), "utf8");
    beforeEach(() => {
      clearCsvCache();
      vi.stubGlobal("fetch", vi.fn(async () => new Response(csv, { status: 200 })));
    });
    afterEach(() => vi.unstubAllGlobals());

    it("needs 29 components for 95% and error drops with more components", async () => {
      render(<PcaCompressionDemo />);
      await screen.findByText("95% üçün lazım", { selector: "p" }, { timeout: 10000 });
      expect(statValue("95% üçün lazım")).toBe("29 komponent");
      const mse10 = Number(statValue("Orta kvadrat xəta"));
      slide("Komponent sayı (d)", 40);
      expect(Number(statValue("Orta kvadrat xəta"))).toBeLessThan(mse10);
    }, 20000);
  });
});

describe("chapter 8 demos (smoke)", () => {
  it("k-means steps: running to the end converges", () => {
    render(<KmeansStepsDemo />);
    fireEvent.click(screen.getByRole("radio", { name: "k-means++" }));
    fireEvent.click(screen.getByRole("button", { name: /Sona qədər/ }));
    expect(statValue("Vəziyyət")).toBe("Yığıldı");
  });

  it("k-means elbow: silhouette picks k = 5", () => {
    render(<KmeansElbowDemo />);
    expect(statValue("Ən yaxşı silhouette")).toBe("k = 5");
  }, 20000);

  it("DBSCAN: eps 0.2 finds the two moons; tiny eps fragments them", () => {
    render(<DbscanDemo />);
    slide(/ε/, 0.2);
    expect(statValue("Klaster")).toBe("2");
    expect(statValue("Küy nöqtəsi")).toBe("0");
    slide(/ε/, 0.05);
    expect(Number(statValue("Klaster"))).toBeGreaterThan(2);
  });

  it("GMM: BIC picks k = 4 (a tiny extra component absorbs the far outliers)", () => {
    render(<GmmAnomalyDemo />);
    expect(statValue("Ən kiçik BIC")).toBe("k = 4");
    expect(Number(statValue("Anomaliya"))).toBeGreaterThan(0);
  }, 20000);
});
