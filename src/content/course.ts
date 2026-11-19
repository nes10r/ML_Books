import type { z } from "zod";
import type { courseSchema } from "@/lib/schemas";

export const course: z.input<typeof courseSchema> = {
  id: "homl-az",
  slug: "praktik-mashin-oyrenmesi",
  title: "Praktik Maşın Öyrənməsi",
  subtitle: "Scikit-Learn və PyTorch ilə interaktiv kurs",
  description:
    "Maşın öyrənməsinin əsaslarından dərin öyrənməyə qədər: vizual simulyasiyalar, riyazi intuisiya, Python laboratoriyaları və praktiki tapşırıqlarla mərhələli kurs.",
  locale: "az",
  source: {
    title: "Hands-On Machine Learning with Scikit-Learn and PyTorch",
    author: "Aurélien Géron",
    publisher: "O'Reilly Media",
    year: 2025,
    url: "https://homl.info",
  },
  parts: [
    {
      id: "part-1",
      number: 1,
      title: "Maşın öyrənməsinin əsasları",
      description:
        "Klassik ML: məlumatla işləmə, reqressiya və təsnifat, model təlimi, qərar ağacları, ansambllar, ölçü azaldılması və nəzarətsiz öyrənmə.",
    },
    {
      id: "part-2",
      number: 2,
      title: "Neyron şəbəkələr və dərin öyrənmə",
      description:
        "Süni neyron şəbəkələri, PyTorch, kompüter görməsi, ardıcıllıqlar, transformerlər, generativ modellər və gücləndirməli öyrənmə.",
    },
  ],
};
