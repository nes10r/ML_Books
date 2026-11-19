import type { z } from "zod";
import type { codeExampleSchema, mediaAssetSchema } from "@/lib/schemas";

const dir = "chapters/08-unsupervised-learning/code";

/** Expected outputs were produced with Python 3.11, numpy 2.4, scikit-learn 1.8. */
export const chapter08CodeExamples: z.input<typeof codeExampleSchema>[] = [
  {
    id: "ch08.code.kmeans",
    title: "k-means: təlim və inisializasiya",
    description: "KMeans, inertia, yeni nöqtələrin proqnozu, təsadüfi və k-means++ başlanğıcların müqayisəsi, MiniBatchKMeans.",
    language: "python",
    file: `${dir}/kmeans_basics.py`,
    expectedOutput: `Tapılan mərkəzlər:
 [[-3.05  2.45]
 [-1.48 -1.58]
 [ 0.56  2.76]
 [ 2.77  0.52]
 [ 3.47  3.47]]
Inertia = 547.2, iterasiya sayı = 3
Yeni nöqtələrin klasterləri: [0 3 2] | mərkəzlərə məsafələr:
 [[0.94 3.88 3.08 3.15 3.76]
 [2.56 5.74 6.06 1.5  1.54]
 [3.57 4.83 0.55 6.29 6.48]]

20 tək təsadüfi başlanğıc: ən yaxşı inertia = 547.2, ən pis = 1411.1, pis nəticələrin sayı = 8
20 tək k-means++ başlanğıc: ən pis = 547.2, pis nəticələrin sayı = 0
MiniBatchKMeans inertia = 549.0 (adi k-means: 547.2)`,
    chapterId: "ch08",
    lessonId: "ch08.kmeans",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch08.code.choosing-k",
    title: "k-nın seçimi",
    description: "k = 2…8 üçün inertia və silhouette balı.",
    language: "python",
    file: `${dir}/choosing_k.py`,
    expectedOutput: ` k |  inertia | silhouette
 2 |   4270.6 |      0.529
 3 |   2378.7 |      0.593
 4 |   1469.9 |      0.574
 5 |    547.2 |      0.711
 6 |    483.7 |      0.641
 7 |    450.0 |      0.554
 8 |    407.2 |      0.487
Ən yüksək silhouette: k = 5`,
    chapterId: "ch08",
    lessonId: "ch08.choosing-k",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch08.code.applications",
    title: "Seqmentasiya və yarı-nəzarətli öyrənmə",
    description: "Sintetik mənzərənin rəng seqmentasiyası və 50 etiketlə rəqəm təsnifatı.",
    language: "python",
    file: `${dir}/kmeans_applications.py`,
    expectedOutput: `2 rəng: orta rəng xətası = 0.112, günəş ayrı seqmentdir? False
4 rəng: orta rəng xətası = 0.037, günəş ayrı seqmentdir? True
8 rəng: orta rəng xətası = 0.023, günəş ayrı seqmentdir? True

50 təsadüfi etiketli şəkil:            test = 0.861
50 nümayəndə şəkil (klaster mərkəzləri): test = 0.922
Etiketlərin klasterə yayılması (1437):   test = 0.922, yayılmış etiketlərin dəqiqliyi = 0.955`,
    chapterId: "ch08",
    lessonId: "ch08.kmeans-applications",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch08.code.dbscan",
    title: "DBSCAN",
    description: "Fərqli ε qiymətləri, k-means ilə müqayisə (ARI) və yeni nöqtələr üçün KNN ilə proqnoz.",
    language: "python",
    file: `${dir}/dbscan.py`,
    expectedOutput: `eps = 0.05: klaster = 15, küy nöqtəsi = 124, əsas nöqtə = 726, ARI = 0.210
eps = 0.2: klaster = 2, küy nöqtəsi = 0, əsas nöqtə = 1000, ARI = 1.000
k-means (k = 2): ARI = 0.239
Yeni nöqtələr: [-1  0  1 -1]`,
    chapterId: "ch08",
    lessonId: "ch08.dbscan",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch08.code.gmm",
    title: "Qauss qarışıqları və anomaliyalar",
    description: "GaussianMixture, sıxlıq həddi ilə anomaliyalar, BIC/AIC, Bayes GMM və IsolationForest.",
    language: "python",
    file: `${dir}/gaussian_mixture.py`,
    expectedOutput: `Çəkilər: [0.44  0.279 0.281]
Ortalar:
 [[-0.03 -0.04]
 [ 3.   -2.46]
 [ 5.02  3.04]]
EM yığıldı? True, iterasiya = 4
Anomaliya həddi (log sıxlıq) = -5.76, anomaliya sayı = 18

 k |      BIC |      AIC
 1 |   7999.7 |   7975.6
 2 |   6957.9 |   6905.1
 3 |   5869.5 |   5787.9
 4 |   5910.9 |   5800.4
 5 |   5945.6 |   5806.3
 6 |   5982.2 |   5814.1

Bayes GMM (8 komponentlə başladı), çəkilər: [0.439 0.283 0.278 0.    0.    0.    0.    0.   ]
IsolationForest anomaliyalarının GMM ilə üst-üstə düşmə payı: 33%`,
    chapterId: "ch08",
    lessonId: "ch08.gmm",
    libraries: ["numpy", "scikit-learn"],
  },
];

export const chapter08Media: z.input<typeof mediaAssetSchema>[] = [
  {
    id: "ch08.media.clustering-shapes",
    type: "image",
    title: "Klasterləşdirmə alqoritmləri və formalar",
    src: "/media/ch08/clustering-shapes.svg",
    alt: "Üç panel: dəyirmi qruplarda k-means yaxşı işləyir; iç-içə aylarda k-means səhv kəsir, DBSCAN isə düzgün ayırır; uzunsov maili qruplarda GMM ellipslərlə formanı öyrənir.",
    width: 960,
    height: 360,
    caption: "Hər alqoritmin klaster haqqında öz fərziyyəsi var: mərkəz (k-means), sıxlıq (DBSCAN), Qauss forması (GMM).",
    credit: "Platforma üçün orijinal diaqram",
    license: "CC BY 4.0",
    chapterId: "ch08",
  },
];
