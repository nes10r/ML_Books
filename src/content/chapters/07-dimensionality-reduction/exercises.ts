import type { z } from "zod";
import type { exerciseSchema } from "@/lib/schemas";

export const chapter07Exercises: z.input<typeof exerciseSchema>[] = [
  {
    "id": "ch07.ex.curse",
    "title": "Ölçü lənəti və k-NN",
    "prompt": "make_classification(n_informative=5) ilə 1 000 nümunə yaradın və əlamət sayını 5, 20, 100, 500-ə qədər faydasız əlamətlərlə artırın. Hər halda KNeighborsClassifier-in CV dəqiqliyini ölçün. Sonra SelectKBest və ya PCA ilə ölçünü azaldıb nəticəni təkrarlayın.",
    "kind": "coding",
    "difficulty": "intermediate",
    "estimatedDuration": 30,
    "chapterId": "ch07",
    "lessonId": "ch07.curse"
  },
  {
    "id": "ch07.ex.pca-manual",
    "title": "PCA-nı kovariasiya ilə hesablayın",
    "prompt": "pca_basics.py-dəki məlumat üçün kovariasiya matrisini hesablayın (np.cov), np.linalg.eigh ilə məxsusi vektorlarını tapın və onları SVD nəticəsi və Scikit-Learn komponentləri ilə müqayisə edin. Məxsusi qiymətlərin cəminə nisbəti izah olunan dispersiya payı ilə üst-üstə düşürmü?",
    "kind": "coding",
    "difficulty": "intermediate",
    "estimatedDuration": 25,
    "chapterId": "ch07",
    "lessonId": "ch07.pca",
    "hints": [
      "eigh məxsusi qiymətləri artan sıra ilə qaytarır.",
      "Vektorların işarəsi fərqli ola bilər — bu, eyni oxdur."
    ]
  },
  {
    "id": "ch07.ex.compression",
    "title": "Sıxılma və təsnifat",
    "prompt": "pca_digits.py-də n_components-i 5, 10, 20, 29, 40 qiymətləri ilə sınayın. Hər biri üçün bərpa xətasını və StandardScaler + PCA + LogisticRegression-un CV dəqiqliyini ölçün. Hansı nöqtədən sonra əlavə komponentlər dəqiqliyi demək olar ki, artırmır?",
    "kind": "research",
    "difficulty": "intermediate",
    "estimatedDuration": 30,
    "chapterId": "ch07",
    "lessonId": "ch07.pca-practice"
  },
  {
    "id": "ch07.ex.jl",
    "title": "JL lemmasını yoxlayın",
    "prompt": "random_projection.py-də ε = 0.1, 0.2, 0.3 üçün proyeksiya edib həqiqi məsafə nisbətlərinin paylanmasını histoqramla göstərin. Neçə faiz cüt ±ε sərhədindən kənara çıxır? Sonra ölçü sayını JL həddinin yarısına endirin və nəticəni müqayisə edin.",
    "kind": "coding",
    "difficulty": "advanced",
    "estimatedDuration": 30,
    "chapterId": "ch07",
    "lessonId": "ch07.random-projection"
  },
  {
    "id": "ch07.ex.tsne",
    "title": "Rəqəmlərin xəritəsi",
    "prompt": "Bütün rəqəmləri t-SNE ilə 2D-yə endirin və hər nöqtəni rəqəminin rəngi ilə çəkin. Hansı rəqəmlər üst-üstə düşür? Sonra eyni şeyi PCA, Isomap və LLE ilə edin. Fəsil 3-ün səhvlərin təhlili dərsindəki qarışıqlıq matrisi ilə müqayisə edin.",
    "kind": "coding",
    "difficulty": "intermediate",
    "estimatedDuration": 35,
    "chapterId": "ch07",
    "lessonId": "ch07.manifold",
    "hints": [
      "t-SNE yavaşdır — əvvəlcə PCA ilə 30–50 ölçüyə endirmək onu sürətləndirir."
    ]
  }
];
