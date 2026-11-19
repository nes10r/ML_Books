import { readFileSync } from "node:fs";
import path from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearCsvCache } from "@/lib/data/use-dataset";
import ConfusionExplorerDemo from "./confusion-explorer-demo";
import DigitDrawDemo from "./digit-draw-demo";
import RocCompareDemo from "./roc-compare-demo";
import ThresholdExplorerDemo from "./threshold-explorer-demo";

const files: Record<string, string> = {
  "/data/digits-8x8.csv": readFileSync(path.join(process.cwd(), "public/data/digits-8x8.csv"), "utf8"),
  "/data/digits-model-outputs.csv": readFileSync(path.join(process.cwd(), "public/data/digits-model-outputs.csv"), "utf8"),
};

describe("chapter 3 demos (smoke, real data)", () => {
  beforeEach(() => {
    clearCsvCache();
    vi.stubGlobal("fetch", vi.fn(async (url: string) => new Response(files[url] ?? "", { status: files[url] ? 200 : 404 })));
  });
  afterEach(() => vi.unstubAllGlobals());

  const statValue = (label: string) => screen.getByText(label, { selector: "p" }).nextSibling!.textContent!;

  it("threshold explorer: default SGD threshold reproduces the Python confusion matrix", async () => {
    render(<ThresholdExplorerDemo />);
    await screen.findByText("Precision", { selector: "p" });
    expect(statValue("Precision")).toBe("97.0%");
    expect(statValue("Recall")).toBe("88.3%");
    expect(statValue("Müsbət proqnoz")).toBe("132");
  });

  it("ROC compare: AUC values match scikit-learn", async () => {
    render(<RocCompareDemo />);
    await screen.findByText("SGD — AUC 0.9807");
    expect(screen.getByText("Təsadüfi meşə — AUC 0.9952")).toBeInTheDocument();
  });

  it("digit draw: starts with a correctly classified held-out test image and clears", async () => {
    render(<DigitDrawDemo />);
    expect(await screen.findByText(/Düzgündür — həqiqi etiket 3/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Təmizlə/ }));
    expect(screen.getByText(/Lövhəyə rəqəm çəkin/)).toBeInTheDocument();
    fireEvent.keyDown(screen.getAllByRole("gridcell")[27]!, { key: " " });
    expect(screen.queryByText(/Lövhəyə rəqəm çəkin/)).not.toBeInTheDocument();
  });

  it("confusion explorer: selects the worst confusion (2 → 8) and shows its images", async () => {
    render(<ConfusionExplorerDemo />);
    expect(await screen.findByText(/Həqiqi/, { selector: "p" })).toHaveTextContent("Həqiqi 2 → proqnoz 8: 7 şəkil");
    expect(screen.getAllByRole("img", { name: /həqiqi 2, proqnoz 8/ })).toHaveLength(7);
    expect(statValue("Səhv sayı")).toBe("82");
  });
});
