import { describe, expect, it } from "vitest";
import { glossaryTermSchema } from "@/lib/schemas";
import { filterTerms, normalizeForSearch } from "./glossary-browser";

describe("glossary search", () => {
  it("normalizes Azerbaijani letters", () => {
    expect(normalizeForSearch("Seçmə Qərəzi")).toBe("secme qerezi");
    expect(normalizeForSearch("Işıq")).toBe("isiq");
  });

  it("matches Azerbaijani, English and aliases", () => {
    const terms = [
      glossaryTermSchema.parse({ id: "a", az: "Seçmə qərəzi", en: "Sampling Bias", definition: "Qərəzli seçmə haqqında." }),
      glossaryTermSchema.parse({ id: "b", az: "Etiket", en: "Label", definition: "Düzgün cavab.", aliases: ["target"] }),
    ];
    expect(filterTerms(terms, "secme").map((t) => t.id)).toEqual(["a"]);
    expect(filterTerms(terms, "label").map((t) => t.id)).toEqual(["b"]);
    expect(filterTerms(terms, "TARGET").map((t) => t.id)).toEqual(["b"]);
    expect(filterTerms(terms, "  ")).toHaveLength(2);
  });
});
