import { readFileSync } from "node:fs";
import path from "node:path";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CorrelationExplorerDemo from "./correlation-explorer-demo";
import FeatureScalingDemo from "./feature-scaling-demo";
import GridSearchDemo from "./grid-search-demo";
import StratifiedSplitDemo from "./stratified-split-demo";
import { clearCsvCache } from "@/lib/data/use-dataset";

const csv = readFileSync(path.join(process.cwd(), "public/data/baku-apartments.csv"), "utf8");

describe("chapter 2 demos (smoke, real dataset)", () => {
  beforeEach(() => {
    clearCsvCache();
    vi.stubGlobal("fetch", vi.fn(async () => new Response(csv, { status: 200 })));
  });
  afterEach(() => vi.unstubAllGlobals());

  it("stratified-split renders with stratified error far below random", async () => {
    render(<StratifiedSplitDemo />);
    const strat = await screen.findByText("Maks. fərq (stratifik)");
    const value = parseFloat(strat.nextSibling!.textContent!);
    expect(value).toBeLessThan(0.5);
  });

  it("correlation explorer: fixing typos raises the area correlation", async () => {
    render(<CorrelationExplorerDemo />);
    const label = await screen.findByText("Pearson r (qiymət ilə)");
    const before = Number(label.nextSibling!.textContent);
    fireEvent.click(screen.getByLabelText(/yazı səhvlərini düzəlt/i));
    const after = Number(screen.getByText("Pearson r (qiymət ilə)").nextSibling!.textContent);
    expect(after).toBeGreaterThan(before + 0.15);
  });

  it("feature scaling: log + standard lowers skewness", async () => {
    render(<FeatureScalingDemo />);
    const label = await screen.findByText("Əyilmə");
    const raw = Number(label.nextSibling!.textContent);
    fireEvent.click(screen.getByRole("radio", { name: "Log + standart" }));
    const logged = Number(screen.getByText("Əyilmə").nextSibling!.textContent);
    expect(Math.abs(logged)).toBeLessThan(Math.abs(raw));
  });

  it("grid search runs and marks a scaled configuration as best", async () => {
    render(<GridSearchDemo />);
    fireEvent.click(await screen.findByRole("button", { name: /Axtarışı başlat/ }));
    const miq = await screen.findByText("Miqyaslama", {}, { timeout: 10000 });
    expect(miq.nextSibling!.textContent).not.toBe("Miqyaslama");
  }, 20000);

  it("shows an error with retry when the dataset fails to load", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 500 })));
    render(<FeatureScalingDemo />);
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("HTTP 500"));
    expect(screen.getByRole("button", { name: "Yenidən cəhd et" })).toBeInTheDocument();
  });
});
