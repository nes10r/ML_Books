import type { z } from "zod";
import type { codeExampleSchema, mediaAssetSchema } from "@/lib/schemas";

const dir = "chapters/07-dimensionality-reduction/code";

/** Expected outputs were produced with Python 3.11, numpy 2.4, scikit-learn 1.8. */
export const chapter07CodeExamples: z.input<typeof codeExampleSchema>[] = [
  {
    id: "ch07.code.curse",
    title: "Ölçü lənəti rəqəmlərlə",
    description: "Ölçü artdıqca orta məsafə, kənara yaxın nöqtələrin payı və ən yaxın/ən uzaq məsafə nisbəti.",
    language: "python",
    file: `${dir}/curse.py`,
    expectedOutput: `  ölçü |  orta məsafə |  kənara 1%-dən yaxın | ən yaxın / ən uzaq
     2 |         0.52 |                4.2% |               0.03
     3 |         0.65 |                6.8% |               0.04
    10 |         1.27 |               18.1% |               0.31
   100 |         4.08 |               86.1% |               0.71
  1000 |        12.90 |              100.0% |               0.89
 10000 |        40.82 |              100.0% |               0.97`,
    chapterId: "ch07",
    lessonId: "ch07.curse",
    libraries: ["numpy"],
  },
  {
    id: "ch07.code.pca",
    title: "PCA: SVD və Scikit-Learn",
    description: "3D məlumatın əsas komponentləri əl ilə (SVD) və Scikit-Learn ilə, izah olunan dispersiya.",
    language: "python",
    file: `${dir}/pca_basics.py`,
    expectedOutput: `Birinci əsas komponent (vahid vektor): [-0.759 -0.612 -0.223]
Scikit-Learn komponentləri:
 [[ 0.759  0.612  0.223]
 [-0.572  0.79  -0.219]]
Əl ilə və Scikit-Learn proyeksiyaları eynidirmi (işarəyə qədər)? True
İzah olunan dispersiya payı: [0.9294 0.0688]
İtirilən dispersiya: 0.19%`,
    chapterId: "ch07",
    lessonId: "ch07.pca",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch07.code.pca-digits",
    title: "Rəqəmlərdə PCA",
    description: "Ölçü sayının seçimi, sıxılma və bərpa, randomized və incremental PCA, PCA-nın təsnifata təsiri.",
    language: "python",
    file: `${dir}/pca_digits.py`,
    expectedOutput: `Dispersiyanın 80%-ni saxlamaq üçün: 13 ölçü (64-dən)
Dispersiyanın 90%-ni saxlamaq üçün: 21 ölçü (64-dən)
Dispersiyanın 95%-ni saxlamaq üçün: 29 ölçü (64-dən)
Dispersiyanın 99%-ni saxlamaq üçün: 41 ölçü (64-dən)

Sıxılma: 64 → 29 ölçü (ölçünün 45%-i), orta bərpa xətası = 0.85
Randomized PCA ilə izah olunan dispersiya: 0.9548
Incremental PCA ilə izah olunan dispersiya: 0.9531
64 piksel  CV dəqiqliyi = 0.920
PCA (95%)  CV dəqiqliyi = 0.912`,
    chapterId: "ch07",
    lessonId: "ch07.pca-practice",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch07.code.random-projection",
    title: "Təsadüfi proyeksiya",
    description: "Conson–Lindenştraus həddi və 10 000 ölçülü məlumatın təsadüfi proyeksiyası.",
    language: "python",
    file: `${dir}/random_projection.py`,
    expectedOutput: `ε = 0.1: məsafələri ±10% daxilində saxlamaq üçün kifayətdir d = 6515
ε = 0.2: məsafələri ±20% daxilində saxlamaq üçün kifayətdir d = 1754
ε = 0.3: məsafələri ±30% daxilində saxlamaq üçün kifayətdir d = 844
Gaussian 10000 → 1754 ölçü: məsafə nisbəti min = 0.953, max = 1.053
Sparse   10000 → 1754 ölçü: məsafə nisbəti min = 0.954, max = 1.057`,
    chapterId: "ch07",
    lessonId: "ch07.random-projection",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch07.code.manifold",
    title: "LLE, Isomap və t-SNE",
    description: "İsveçrə rulonunun açılması və rəqəmlərin t-SNE ilə vizuallaşdırılmasının keyfiyyəti.",
    language: "python",
    file: `${dir}/manifold.py`,
    expectedOutput: `İsveçrə rulonu, PCA   : t ilə ən güclü korrelyasiya = 0.219
İsveçrə rulonu, LLE   : t ilə ən güclü korrelyasiya = 0.997
İsveçrə rulonu, Isomap: t ilə ən güclü korrelyasiya = 0.992
Rəqəmlər, PCA   : trustworthiness = 0.799
Rəqəmlər, t-SNE : trustworthiness = 0.993`,
    chapterId: "ch07",
    lessonId: "ch07.manifold",
    libraries: ["numpy", "scikit-learn"],
  },
];

export const chapter07Media: z.input<typeof mediaAssetSchema>[] = [
  {
    id: "ch07.media.projection-manifold",
    type: "image",
    title: "Proyeksiya və manifold öyrənmə",
    src: "/media/ch07/projection-manifold.svg",
    alt: "Sol tərəfdə demək olar ki, müstəvi üzərində yerləşən 3D nöqtələr müstəviyə proyeksiya olunur; sağ tərəfdə rulon şəklində əyilmiş məlumat: proyeksiya qatları üst-üstə salır, manifold öyrənmə isə rulonu düz lent kimi açır.",
    width: 960,
    height: 380,
    caption: "Məlumat müstəviyə yaxındırsa, proyeksiya kifayətdir; əyilmiş səthi isə “açmaq” lazımdır.",
    credit: "Platforma üçün orijinal diaqram",
    license: "CC BY 4.0",
    chapterId: "ch07",
  },
];
