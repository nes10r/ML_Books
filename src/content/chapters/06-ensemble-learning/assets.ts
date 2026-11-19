import type { z } from "zod";
import type { codeExampleSchema, mediaAssetSchema } from "@/lib/schemas";

const dir = "chapters/06-ensemble-learning/code";

/** Expected outputs were produced with Python 3.11, numpy 2.4, scikit-learn 1.8. */
export const chapter06CodeExamples: z.input<typeof codeExampleSchema>[] = [
  {
    id: "ch06.code.voting",
    title: "Səsvermə təsnifatçısı",
    description: "Dörd fərqli model, sərt və yumşaq səsvermə “aylar” məlumatında.",
    language: "python",
    file: `${dir}/voting.py`,
    expectedOutput: `  lr: 0.853
 knn: 0.912
 svc: 0.917
  rf: 0.907
Sərt səsvermə:   0.915
Yumşaq səsvermə: 0.918`,
    chapterId: "ch06",
    lessonId: "ch06.voting",
    libraries: ["scikit-learn"],
  },
  {
    id: "ch06.code.bagging",
    title: "Bagging, pasting və OOB",
    description: "Tək ağac, bagging və pasting müqayisəsi, OOB qiymətləndirmə.",
    language: "python",
    file: `${dir}/bagging_oob.py`,
    expectedOutput: `Tək ağac:            test = 0.883
Bagging (qaytarmaqla): test = 0.915
Pasting (qaytarmadan): test = 0.912

OOB qiymətləndirmə = 0.903   (test dəsti: 0.915)
İlk nümunə üçün OOB ehtimalları: [0.94 0.06]`,
    chapterId: "ch06",
    lessonId: "ch06.bagging",
    libraries: ["scikit-learn"],
  },
  {
    id: "ch06.code.forest",
    title: "Təsadüfi meşə və əlamət əhəmiyyəti",
    description: "RandomForest və ExtraTrees, rəqəm şəkillərində piksellərin əhəmiyyəti.",
    language: "python",
    file: `${dir}/random_forest.py`,
    expectedOutput: `RandomForest  test = 0.917
ExtraTrees    test = 0.907

Rəqəmlər, 5 qatlı CV = 0.940
Piksellərin əhəmiyyəti (8×8, tünd = vacib):
      --....--..  
    ::++..--++..  
    ..====++@@..  
    ::##==**==++  
    ++++--##--==  
    ::**%%----==  
      --==::====  
      ==..==++--  
Kənar sütunlardakı (0 və 7) piksellərin ümumi əhəmiyyəti: 0.007
Mərkəzi 4×4 blokun ümumi əhəmiyyəti: 0.471`,
    chapterId: "ch06",
    lessonId: "ch06.random-forests",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch06.code.boosting",
    title: "AdaBoost, Gradient Boosting və HistGradientBoosting",
    description: "Kötüklərdən AdaBoost, temperatur məlumatında GBR və erkən dayandırma, rəqəmlərdə histoqram bustinqi.",
    language: "python",
    file: `${dir}/boosting.py`,
    expectedOutput: `Tək kötük: 0.808   AdaBoost (200 kötük): 0.908
GBR η=1.0  ağac=3    test RMSE = 2.04
GBR η=0.1  ağac=3    test RMSE = 4.70
GBR η=0.1  ağac=100  test RMSE = 1.43
Erkən dayandırma: 101 ağacdan sonra dayandı, test RMSE = 1.59
HistGradientBoosting (rəqəmlər): test = 0.958`,
    chapterId: "ch06",
    lessonId: "ch06.boosting",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch06.code.stacking",
    title: "Stacking ansamblı",
    description: "Dörd əsas model və logistik reqressiya blender-i ilə StackingClassifier.",
    language: "python",
    file: `${dir}/stacking.py`,
    expectedOutput: `  lr: 0.853
 knn: 0.912
 svc: 0.917
  rf: 0.907
Stacking: 0.920
Blender-in əmsalları (hər əsas modelin “sinif 1” ehtimalına verdiyi çəki): [[0.13 3.22 1.7  1.7 ]]`,
    chapterId: "ch06",
    lessonId: "ch06.stacking",
    libraries: ["scikit-learn"],
  },
];

export const chapter06Media: z.input<typeof mediaAssetSchema>[] = [
  {
    id: "ch06.media.ensemble-types",
    type: "image",
    title: "Ansambl üsullarının xəritəsi",
    src: "/media/ch06/ensemble-types.svg",
    alt: "Üç sütun: səsvermə (fərqli modellər paralel, səs çoxluğu), bagging (eyni model, məlumatın fərqli bootstrap nüsxələri, ortalama), bustinq (modellər ardıcıl, hər biri əvvəlkinin səhvlərini düzəldir).",
    width: 960,
    height: 380,
    caption: "Paralel və müstəqil (səsvermə, bagging) və ardıcıl (bustinq) ansambllar.",
    credit: "Platforma üçün orijinal diaqram",
    license: "CC BY 4.0",
    chapterId: "ch06",
  },
];
