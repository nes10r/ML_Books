import { describe, expect, it } from "vitest";
import { fixAreaTypo, toApartments } from "./apartments";
import { parseCsv } from "./csv";

describe("parseCsv", () => {
  it("parses numbers, empty cells and quoted fields", () => {
    const { columns, rows } = parseCsv('a,b,c\r\n1,"x, ""y""",\n2.5,əla,3\n');
    expect(columns).toEqual(["a", "b", "c"]);
    expect(rows).toEqual([
      { a: 1, b: 'x, "y"', c: null },
      { a: 2.5, b: "əla", c: 3 },
    ]);
  });

  it("handles a BOM and a missing trailing newline", () => {
    expect(parseCsv("﻿k\n7").rows).toEqual([{ k: 7 }]);
  });
});

describe("apartments", () => {
  it("types rows and drops incomplete ones", () => {
    const { rows } = parseCsv("id,rayon,enlik,uzunluq,sahe,otaq_sayi,mertebe,bina_mertebe,tikili,temir,metro_mesafe,kupca,qiymet\n1,Səbail,40.3,49.8,60,,2,9,yeni,,1.2,1,150000\n2,Xətai,40.3,49.9,,2,1,5,köhnə,orta,,1,90000\n");
    const data = toApartments(rows);
    expect(data).toHaveLength(1);
    expect(data[0]).toMatchObject({ rayon: "Səbail", otaq_sayi: null, temir: null, metro_mesafe: 1.2 });
  });
  it("fixes decimal-point typos above 400 m²", () => {
    expect(fixAreaTypo(725)).toBe(72.5);
    expect(fixAreaTypo(120)).toBe(120);
  });
});
