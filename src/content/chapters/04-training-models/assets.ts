import type { z } from "zod";
import type { codeExampleSchema, mediaAssetSchema } from "@/lib/schemas";

const dir = "chapters/04-training-models/code";

/** Expected outputs were produced with Python 3.11, numpy 2.4, scikit-learn 1.8. */
export const chapter04CodeExamples: z.input<typeof codeExampleSchema>[] = [
  {
    id: "ch04.code.linear-model",
    title: "Vektorlaşdırılmış xətti model",
    description: "Sintetik məlumatda X_b · θ ilə bütün proqnozları bir əməliyyatla hesablamaq və müxtəlif θ üçün MSE-ni müqayisə etmək.",
    language: "python",
    file: `${dir}/linear_model.py`,
    expectedOutput: `X_b forması: (100, 2)
θ = [0. 0.] → MSE = 33.300
θ = [2. 2.] → MSE = 0.653
θ = [3.  1.8] → MSE = 0.195`,
    chapterId: "ch04",
    lessonId: "ch04.linear-regression",
    libraries: ["numpy"],
  },
  {
    id: "ch04.code.normal-equation",
    title: "Normal tənlik, pinv və LinearRegression",
    description: "Eyni həllin üç yolla tapılması və əlamət sayı artdıqca pinv-in yavaşlaması. Vaxtlar kompüterdən asılı olaraq fərqlənəcək.",
    language: "python",
    file: `${dir}/normal_equation.py`,
    expectedOutput: `Normal tənlik: [3.0041 1.7536]
pinv:          [3.0041 1.7536]
lstsq:         [3.0041 1.7536]
LinearRegression: θ₀ = 3.0041  θ₁ = [1.7536]
x = 2.5 üçün proqnoz: [7.388]
n =  200 əlamət: pinv 0.113 s
n =  400 əlamət: pinv 0.182 s
n =  800 əlamət: pinv 0.666 s`,
    chapterId: "ch04",
    lessonId: "ch04.normal-equation",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch04.code.batch-gd",
    title: "Sıfırdan paket qradiyent enmə",
    description: "Üç öyrənmə sürəti ilə qradiyent enmə və miqyaslanmamış/standartlaşdırılmış əlamətlərin müqayisəsi.",
    language: "python",
    file: `${dir}/batch_gd.py`,
    expectedOutput: `η = 0.02 → 1000 epoxa: θ = [3.004 1.754]
η = 0.1  → 1000 epoxa: θ = [3.004 1.754]
η = 0.5  →  725 epoxa: uzaqlaşdı!

Miqyaslanmamış (η=1e-6, 1000 epoxa): θ = [0.003 0.007 0.012], MSE = 10.320
Standartlaşdırılmış (η=0.1, 1000 epoxa): MSE = 0.201`,
    chapterId: "ch04",
    lessonId: "ch04.gradient-descent",
    libraries: ["numpy"],
  },
  {
    id: "ch04.code.sgd",
    title: "Stoxastik və mini-paket GD",
    description: "Öyrənmə cədvəli ilə SGD, mini-paket GD və SGDRegressor nəticələrinin müqayisəsi.",
    language: "python",
    file: `${dir}/sgd_minibatch.py`,
    expectedOutput: `SGD (50 epoxa):        θ = [2.997 1.784]
Mini-paket (50 epoxa): θ = [2.973 1.776]
SGDRegressor:          θ₀ = [3.002]  θ₁ = [1.755]`,
    chapterId: "ch04",
    lessonId: "ch04.sgd",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch04.code.polynomial",
    title: "Polinom reqressiya və öyrənmə əyriləri",
    description: "PolynomialFeatures ilə kvadratik modelin öyrənilməsi və 1, 2, 10 dərəcəli modellərin learning_curve nəticələri.",
    language: "python",
    file: `${dir}/polynomial_learning_curves.py`,
    expectedOutput: `x[0] = [-2.486] → [x, x²] = [-2.486  6.181]
Öyrənilmiş: ŷ = 1.94 + -1.12 x + 0.54 x²
Həqiqi:     y = 2 - 1.2 x + 0.5 x²

dərəcə  1 (təlim/validasiya RMSE)  m=10: 1.02/2.00  m=30: 1.47/1.55  m=60: 1.44/1.55  m=96: 1.51/1.55
dərəcə  2 (təlim/validasiya RMSE)  m=10: 0.65/1.12  m=30: 0.80/0.80  m=60: 0.75/0.77  m=96: 0.74/0.77
dərəcə 10 (təlim/validasiya RMSE)  m=10: 0.00/244.12  m=30: 0.59/1.28  m=60: 0.67/0.98  m=96: 0.71/0.80`,
    chapterId: "ch04",
    lessonId: "ch04.polynomial",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch04.code.regularization",
    title: "Ridge, Lasso, Elastic Net və erkən dayandırma",
    description: "4 faydasız əlamətli məlumatda əmsalların müqayisəsi və SGDRegressor ilə erkən dayandırma.",
    language: "python",
    file: `${dir}/regularization.py`,
    expectedOutput: `Həqiqi:       [ 3.  -2.   1.5  0.   0.   0.   0.5  0. ]
LinearReg    [ 3.41 -2.14  1.48  0.06  0.1  -0.12  0.75  0.13]  sıfır əmsal: 0
Ridge α=10   [ 2.77 -1.76  1.26  0.16  0.09 -0.07  0.69  0.04]  sıfır əmsal: 0
Lasso α=0.3  [ 3.   -1.85  1.15  0.    0.   -0.    0.51  0.  ]  sıfır əmsal: 4
ElasticNet   [ 2.67 -1.68  1.14  0.07  0.   -0.    0.6  -0.  ]  sıfır əmsal: 3

Erkən dayandırma: ən yaxşı epoxa = 49, validasiya RMSE = 0.817`,
    chapterId: "ch04",
    lessonId: "ch04.regularization",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch04.code.logistic",
    title: "Logistik reqressiya: imtahan məlumatı",
    description: "Oxuma və yuxu saatına görə keçmə ehtimalı, qərar sərhədi və C hiperparametrinin təsiri.",
    language: "python",
    file: `${dir}/logistic_regression.py`,
    expectedOutput: `θ₀ = [-8.438]  θ = [[0.836 0.762]]
Test dəqiqliyi = 0.920, log itki = 0.283
oxuma 2 saat, yuxu 6 saat → keçmə ehtimalı 0.10
oxuma 5 saat, yuxu 7 saat → keçmə ehtimalı 0.75
oxuma 8 saat, yuxu 8 saat → keçmə ehtimalı 0.99
Yuxu 7 saat olduqda sərhəd: oxuma ≈ 3.71 saat
C = 0.01  → θ = [0.451 0.229]  (kiçik C = güclü requlyarlaşdırma)
C = 1     → θ = [0.836 0.762]  (kiçik C = güclü requlyarlaşdırma)
C = 100   → θ = [0.854 0.79 ]  (kiçik C = güclü requlyarlaşdırma)`,
    chapterId: "ch04",
    lessonId: "ch04.logistic",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch04.code.softmax",
    title: "Softmax reqressiyası: şərab növləri",
    description: "load_wine dəstində 3 sinifli softmax, ehtimallar və çarpaz entropiya.",
    language: "python",
    file: `${dir}/softmax_wine.py`,
    expectedOutput: `Forma: (178, 13) | siniflər: [59 71 48] | ilk əlamətlər: ['alcohol', 'malic_acid', 'ash']

İlk 3 test nümunəsi üçün ehtimallar (sinif 0, 1, 2):
  [0.926 0.072 0.002]  cəmi = 1.0  proqnoz = 0  həqiqət = 0
  [0.004 0.996 0.   ]  cəmi = 1.0  proqnoz = 1  həqiqət = 1
  [0.999 0.    0.   ]  cəmi = 1.0  proqnoz = 0  həqiqət = 0

Test dəqiqliyi = 1.000, çarpaz entropiya = 0.067
5 qatlı CV dəqiqliyi = 0.985
Əmsallar matrisi forması (sinif × əlamət): (3, 13)`,
    chapterId: "ch04",
    lessonId: "ch04.softmax",
    libraries: ["numpy", "scikit-learn"],
  },
];

export const chapter04Media: z.input<typeof mediaAssetSchema>[] = [
  {
    id: "ch04.media.learning-rate",
    type: "image",
    title: "Öyrənmə sürətinin üç rejimi",
    src: "/media/ch04/learning-rate.svg",
    alt: "Eyni qabarıq xərc əyrisi üzərində üç panel: çox kiçik öyrənmə sürətində çoxlu kiçik addım, uyğun sürətdə bir neçə addımla minimuma çatma, çox böyük sürətdə isə addımların minimumun hər iki tərəfinə sıçrayaraq yuxarı qalxması.",
    width: 960,
    height: 340,
    caption: "Çox kiçik η: yavaş. Uyğun η: sürətli yığılma. Çox böyük η: uzaqlaşma.",
    credit: "Platforma üçün orijinal diaqram",
    license: "CC BY 4.0",
    chapterId: "ch04",
  },
  {
    id: "ch04.media.sigmoid",
    type: "image",
    title: "Siqmoid funksiyası",
    src: "/media/ch04/sigmoid.svg",
    alt: "S formalı siqmoid əyrisi: t mənfi böyük olduqda 0-a, müsbət böyük olduqda 1-ə yaxınlaşır, t = 0 olduqda 0.5-dir. Sağ tərəfdə p ≥ 0.5 olduqda müsbət sinif proqnozlaşdırıldığı göstərilir.",
    width: 960,
    height: 360,
    caption: "σ(t) istənilən balı 0–1 aralığına çevirir. t ≥ 0 ⇔ p ≥ 0.5 ⇔ müsbət sinif.",
    credit: "Platforma üçün orijinal diaqram",
    license: "CC BY 4.0",
    chapterId: "ch04",
  },
];
