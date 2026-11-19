import type { z } from "zod";
import type { codeExampleSchema, mediaAssetSchema } from "@/lib/schemas";

const dir = "chapters/01-machine-learning-landscape/code";

export const chapter01CodeExamples: z.input<typeof codeExampleSchema>[] = [
  {
    id: "ch01.code.first-model",
    title: "İlk model: xətti reqressiya və k-NN",
    description: "Sintetik mənzil məlumatında model əsaslı və nümunə əsaslı yanaşmaların müqayisəsi.",
    language: "python",
    file: `${dir}/first_model.py`,
    expectedOutput: `θ₀ (kəsişmə) = 24.88
θ₁ (meyl)    = 1.384
Xətti reqressiya proqnozu (100 m²): 163.3 min ₼
3-NN proqnozu (100 m²):            159.5 min ₼`,
    chapterId: "ch01",
    lessonId: "ch01.instance-model",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch01.code.online-sgd",
    title: "partial_fit ilə onlayn öyrənmə",
    description: "SGDRegressor modelini məlumat axını üzərində kiçik paketlərlə addım-addım yeniləmək.",
    language: "python",
    file: `${dir}/online_sgd.py`,
    expectedOutput: `Paket 10: θ₀ = 0.261, θ₁ = 0.444
Paket 20: θ₀ = 0.203, θ₁ = 0.554
Paket 30: θ₀ = 0.195, θ₁ = 0.630
Paket 40: θ₀ = 0.182, θ₁ = 0.658
Paket 50: θ₀ = 0.159, θ₁ = 0.675
Həqiqi qiymətlər: θ₀ = 0.150, θ₁ = 0.700`,
    chapterId: "ch01",
    lessonId: "ch01.batch-online",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch01.code.overfitting",
    title: "Polinom dərəcəsi və overfitting",
    description: "Müxtəlif dərəcəli polinom modellərin təlim və validasiya xətalarının ölçülməsi.",
    language: "python",
    file: `${dir}/overfitting.py`,
    expectedOutput: ` dərəcə | təlim RMSE | validasiya RMSE
      1 |      0.287 |           0.474
      3 |      0.141 |           0.317
      5 |      0.138 |           0.298
      8 |      0.085 |           3.905
     11 |      0.000 |         515.075
Ridge(alpha=0.001) 11-ci dərəcə → validasiya RMSE = 0.277
Ridge(alpha=0.1) 11-ci dərəcə → validasiya RMSE = 0.392`,
    chapterId: "ch01",
    lessonId: "ch01.challenges",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch01.code.validation",
    title: "Təlim/test bölgüsü və çarpaz validasiya",
    description: "train_test_split və cross_val_score ilə modelləri düzgün müqayisə etmək.",
    language: "python",
    file: `${dir}/validation.py`,
    expectedOutput: `Xətti reqressiya  CV RMSE = 12.44 ± 1.65
1-NN              CV RMSE = 17.36 ± 1.96
10-NN             CV RMSE = 13.32 ± 1.78
Seçilmiş modelin test RMSE-si: 13.13`,
    chapterId: "ch01",
    lessonId: "ch01.testing-validating",
    libraries: ["numpy", "scikit-learn"],
  },
];

export const chapter01Media: z.input<typeof mediaAssetSchema>[] = [
  {
    id: "ch01.media.traditional-vs-ml",
    type: "image",
    title: "Ənənəvi proqramlaşdırma və maşın öyrənməsi",
    src: "/media/ch01/traditional-vs-ml.svg",
    alt: "Sol tərəfdə qaydalar və məlumat proqrama daxil olub cavab çıxır; sağ tərəfdə məlumat və cavablar ML alqoritminə daxil olub model (qaydalar) çıxır.",
    width: 960,
    height: 420,
    caption: "Ənənəvi yanaşmada qaydaları biz yazırıq. ML-də isə qaydalar nümunələrdən öyrənilir.",
    credit: "Platforma üçün orijinal diaqram",
    license: "CC BY 4.0",
    chapterId: "ch01",
  },
  {
    id: "ch01.media.ml-pipeline",
    type: "image",
    title: "Paket və onlayn öyrənmə axını",
    src: "/media/ch01/ml-pipeline.svg",
    alt: "Yuxarıda paket öyrənmə: bütün məlumat bir dəfə modelə verilir və model istifadəyə buraxılır. Aşağıda onlayn öyrənmə: məlumat kiçik hissələrlə davamlı gəlir və model hər hissə ilə yenilənir.",
    width: 960,
    height: 400,
    caption: "Paket öyrənmədə model periodik olaraq sıfırdan öyrədilir. Onlayn öyrənmədə isə hər yeni hissə ilə yenilənir.",
    credit: "Platforma üçün orijinal diaqram",
    license: "CC BY 4.0",
    chapterId: "ch01",
  },
  {
    id: "ch01.media.data-split",
    type: "image",
    title: "Təlim, validasiya və test dəstləri",
    src: "/media/ch01/data-split.svg",
    alt: "Məlumat zolağı üç hissəyə bölünüb: təxminən 70% təlim, 15% validasiya və 15% test. Altında çarpaz validasiyanın beş turu göstərilir.",
    width: 960,
    height: 380,
    caption: "Test dəsti ən sona qədər “kilidli” qalır. Model seçimi validasiya və ya çarpaz validasiya ilə aparılır.",
    credit: "Platforma üçün orijinal diaqram",
    license: "CC BY 4.0",
    chapterId: "ch01",
  },
];
