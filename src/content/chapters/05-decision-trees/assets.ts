import type { z } from "zod";
import type { codeExampleSchema, mediaAssetSchema } from "@/lib/schemas";

const dir = "chapters/05-decision-trees/code";

/** Expected outputs were produced with Python 3.11, numpy 2.4, scikit-learn 1.8. */
export const chapter05CodeExamples: z.input<typeof codeExampleSchema>[] = [
  {
    id: "ch05.code.fruits",
    title: "Ortaq məlumat modulu: fruits.py",
    description: "Fəslin bütün skriptlərinin idxal etdiyi sintetik “meyvələr” generatoru (naringi, alma, nar: diametr və çəki). Digər skriptlərlə eyni qovluqda saxlayın.",
    language: "python",
    file: `${dir}/fruits.py`,
    chapterId: "ch05",
    lessonId: "ch05.train",
    libraries: ["numpy"],
  },
  {
    id: "ch05.code.train",
    title: "Meyvə təsnifatçısı: təlim və vizuallaşdırma",
    description: "Dərinliyi 2 olan qərar ağacı, export_text ilə mətn vizuallaşdırması, proqnoz və ehtimallar. fruits.py eyni qovluqda olmalıdır.",
    language: "python",
    file: `${dir}/train_tree.py`,
    expectedOutput: `|--- çəki <= 85.80
|   |--- çəki <= 73.85
|   |   |--- weights: [40.00, 1.00, 0.00] class: naringi
|   |--- çəki >  73.85
|   |   |--- weights: [4.00, 2.00, 0.00] class: naringi
|--- çəki >  85.80
|   |--- çəki <= 189.15
|   |   |--- weights: [1.00, 37.00, 4.00] class: alma
|   |--- çəki >  189.15
|   |   |--- weights: [0.00, 5.00, 41.00] class: nar

7 sm, 120 q → proqnoz: alma
Ehtimallar (naringi, alma, nar): [0.024 0.881 0.095]
Yarpaq nömrəsi (apply): 5
Test dəqiqliyi (dərinlik 2): 0.933`,
    chapterId: "ch05",
    lessonId: "ch05.train",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch05.code.cart",
    title: "Kök bölgüsünü əl ilə tapmaq",
    description: "Gini və entropiyanın hesablanması, bütün hədlərin yoxlanması və nəticənin Scikit-Learn-in CART ilə müqayisəsi.",
    language: "python",
    file: `${dir}/cart_impurity.py`,
    expectedOutput: `Kök düyün: Gini = 0.667, entropiya = 1.585 bit
Əl ilə tapılan ən yaxşı bölgü: çəki ≤ 85.80  (sol 47, sağ 88, çəkili Gini = 0.374)
Scikit-Learn (CART) kökdə:       çəki ≤ 85.80
    gini: dərinlik = 8, yarpaq sayı = 25
 entropy: dərinlik = 10, yarpaq sayı = 25`,
    chapterId: "ch05",
    lessonId: "ch05.cart",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch05.code.regularization",
    title: "Məhdudiyyətsiz və requlyarlaşdırılmış ağaclar",
    description: "make_moons məlumatında max_depth və min_samples_leaf-in təsiri və GridSearchCV ilə tənzimləmə.",
    language: "python",
    file: `${dir}/regularization.py`,
    expectedOutput: `model                dərinlik  yarpaq   təlim    test
məhdudiyyətsiz             11      31   1.000   0.856
min_samples_leaf=8          6      14   0.919   0.889
max_depth=4                 4      11   0.914   0.867

GridSearchCV ən yaxşı: {'max_depth': 6, 'min_samples_leaf': 3}, CV dəqiqliyi = 0.876, test = 0.911`,
    chapterId: "ch05",
    lessonId: "ch05.regularization",
    libraries: ["scikit-learn"],
  },
  {
    id: "ch05.code.regression",
    title: "Reqressiya ağacı: temperatur",
    description: "DecisionTreeRegressor ilə gün ərzində temperaturun proqnozu, mətn vizuallaşdırması və overfitting.",
    language: "python",
    file: `${dir}/regression_tree.py`,
    expectedOutput: `|--- saat <= 8.8
|   |--- saat <= 4.6
|   |   |--- value: [4.4]
|   |--- saat >  4.6
|   |   |--- value: [8.2]
|--- saat >  8.8
|   |--- saat <= 20.4
|   |   |--- value: [16.7]
|   |--- saat >  20.4
|   |   |--- value: [9.6]

max_depth=2          yarpaq =   4  təlim RMSE = 2.56  test RMSE = 2.57
max_depth=4          yarpaq =  16  təlim RMSE = 1.46  test RMSE = 1.45
məhdudiyyətsiz       yarpaq = 140  təlim RMSE = 0.00  test RMSE = 1.77
min_samples_leaf=10  yarpaq =  11  təlim RMSE = 1.65  test RMSE = 1.70`,
    chapterId: "ch05",
    lessonId: "ch05.regression",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch05.code.instability",
    title: "Ox istiqaməti və yüksək dispersiya",
    description: "Diaqonal sərhəddə PCA-nın təsiri və fərqli alt-nümunələrdə öyrədilmiş ağacların fərqi.",
    language: "python",
    file: `${dir}/instability.py`,
    expectedOutput: `xam əlamətlər          CV dəqiqliyi = 0.950  yarpaq sayı = 18
StandardScaler + PCA   CV dəqiqliyi = 0.990  yarpaq sayı = 4
alt-nümunə 0: kök bölgüsü x2 ≤ 0.08, yarpaq = 13
alt-nümunə 1: kök bölgüsü x2 ≤ 0.46, yarpaq = 17
alt-nümunə 2: kök bölgüsü x2 ≤ 0.49, yarpaq = 14
alt-nümunə 3: kök bölgüsü x2 ≤ 0.10, yarpaq = 13
alt-nümunə 4: kök bölgüsü x2 ≤ 0.49, yarpaq = 11
Ağacların ən azı birinin fərqli cavab verdiyi nöqtələrin payı: 12.7%`,
    chapterId: "ch05",
    lessonId: "ch05.limitations",
    libraries: ["numpy", "scikit-learn"],
  },
];

export const chapter05Media: z.input<typeof mediaAssetSchema>[] = [
  {
    id: "ch05.media.tree-anatomy",
    type: "image",
    title: "Qərar ağacının anatomiyası",
    src: "/media/ch05/tree-anatomy.svg",
    alt: "Dərinliyi 2 olan meyvə ağacı: kök düyün “çəki ≤ 85.8” sualını verir; sol qolda “çəki ≤ 73.85”, sağ qolda “çəki ≤ 189.15” sualları; dörd yarpaq: naringi [40, 1, 0], naringi [4, 2, 0], alma [1, 37, 4], nar [0, 5, 41].",
    width: 960,
    height: 420,
    caption: "Hər düyündə: sual, nümunə sayı və siniflərin sayı. “Bəli” sola, “xeyr” sağa gedir. Rəqəmlər train_tree.py-nin nəticəsidir.",
    credit: "Platforma üçün orijinal diaqram",
    license: "CC BY 4.0",
    chapterId: "ch05",
  },
  {
    id: "ch05.media.impurity",
    type: "image",
    title: "Gini və entropiya",
    src: "/media/ch05/impurity.svg",
    alt: "İki sinif üçün müsbət sinfin payına (0-dan 1-ə) görə Gini qeyri-müəyyənliyi və entropiya əyriləri: hər ikisi uclarda sıfır, p = 0.5-də maksimumdur; Gini maksimumu 0.5, entropiyanınkı 1 bitdir.",
    width: 960,
    height: 380,
    caption: "Hər iki ölçü təmiz düyündə 0, ən qarışıq düyündə maksimumdur. Müqayisə üçün entropiya 1/2 ilə miqyaslanmış şəkildə də göstərilib.",
    credit: "Platforma üçün orijinal diaqram",
    license: "CC BY 4.0",
    chapterId: "ch05",
  },
];
