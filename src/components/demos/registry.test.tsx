import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { demos } from "@/content/demos";
import { DemoRenderer, registeredDemoIds } from "./registry";

describe("demo registry", () => {
  it.each(demos.map((d) => d.id))("DemoRenderer resolves '%s' without throwing", (id) => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {}))); // dataset demos stay in loading state
    expect(registeredDemoIds).toContain(id);
    expect(() => render(<DemoRenderer id={id} />)).not.toThrow();
    vi.unstubAllGlobals();
  });
});
