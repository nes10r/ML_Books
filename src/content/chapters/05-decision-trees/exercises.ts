import type { z } from "zod";
import type { exerciseSchema } from "@/lib/schemas";

export const chapter05Exercises: z.input<typeof exerciseSchema>[] = [
  {
    id: "ch05.ex.trace-path",
    title: "Yolu izləyin",
    prompt:
      "train_tree.py-nin çıxışındakı ağacdan istifadə edərək aşağıdakı meyvələrin proqnozunu və ehtimallarını əl ilə tapın: (1) 5 sm, 60 q; (2) 7.5 sm, 80 q; (3) 9 sm, 250 q. Sonra tree.predict_proba və tree.decision_path ilə yoxlayın. Hansı meyvədə model ən az əmindir və niyə?",
    kind: "conceptual",
    difficulty: "beginner",
    estimatedDuration: 15,
    chapterId: "ch05",
    lessonId: "ch05.train",
    hints: ["Hər düyündə “bəli” sola, “xeyr” sağa gedir.", "Dərinlik-2 ağac yalnız çəkidən istifadə edir — diametr nəticəyə təsir etmir."],
    solution:
      "(1) 60 ≤ 85.8 və 60 ≤ 73.85 → naringi, [40, 1, 0]/41 ≈ (0.98, 0.02, 0). (2) 80 ≤ 85.8, 80 > 73.85 → naringi, [4, 2, 0]/6 ≈ (0.67, 0.33, 0) — ən az əmin, çünki yarpaqda cəmi 6 nümunə var və onlar qarışıqdır. (3) 250 > 85.8, 250 > 189.15 → nar, [0, 5, 41]/46 ≈ (0, 0.11, 0.89).",
  },
  {
    id: "ch05.ex.gini-by-hand",
    title: "Gini-ni əl ilə hesablayın",
    prompt:
      "Düyündə 6 alma və 2 nar var. Bölgü A: sol [4 alma, 0 nar], sağ [2 alma, 2 nar]. Bölgü B: sol [5 alma, 1 nar], sağ [1 alma, 1 nar]. Hər bölgü üçün çəkili Gini və çəkili entropiya hesablayın. Hər iki ölçüyə görə hansı bölgü daha yaxşıdır?",
    kind: "conceptual",
    difficulty: "intermediate",
    estimatedDuration: 20,
    chapterId: "ch05",
    lessonId: "ch05.cart",
    solution:
      "Kök: Gini = 1 − (0.75² + 0.25²) = 0.375. A: sol 0, sağ 0.5 → (4·0 + 4·0.5)/8 = 0.25. B: sol 1 − (25/36 + 1/36) ≈ 0.278, sağ 0.5 → (6·0.278 + 2·0.5)/8 ≈ 0.333. Gini-yə görə A daha yaxşıdır. Entropiya: A → (4·0 + 4·1)/8 = 0.5 bit; B → sol ≈ 0.650, sağ 1 → (6·0.650 + 2·1)/8 ≈ 0.738 bit. Entropiyaya görə də A daha yaxşıdır.",
  },
  {
    id: "ch05.ex.tune-tree",
    title: "Ağacı tənzimləyin",
    prompt:
      "make_moons(n_samples=10000, noise=0.4) ilə məlumat yaradın və 80/20 bölün. GridSearchCV ilə max_leaf_nodes (2–100) və min_samples_leaf hiperparametrlərini tənzimləyin. Ən yaxşı modeli bütün təlim dəstində öyrədib test dəqiqliyini ölçün. 85%-dən yüksək nəticə almağa çalışın. Məhdudiyyətsiz ağacla müqayisə edin.",
    kind: "coding",
    difficulty: "intermediate",
    estimatedDuration: 30,
    chapterId: "ch05",
    lessonId: "ch05.regularization",
    hints: ["GridSearchCV(..., cv=3) — böyük dəstdə 3 qat kifayətdir.", "max_leaf_nodes ağacın ölçüsünü birbaşa məhdudlaşdırır."],
  },
  {
    id: "ch05.ex.extrapolation",
    title: "Ekstrapolyasiya testi",
    prompt:
      "regression_tree.py-də saat aralığını 0–24-dən 0–18-ə endirib modeli öyrədin, sonra 18–24 aralığında proqnoz verin. Həmin aralıqda LinearRegression və PolynomialFeatures(3) + LinearRegression modellərini də sınayın. Hansı model təlim aralığından kənarda ən ağlabatan davranır? Ağacın proqnozunu qrafikdə göstərin.",
    kind: "coding",
    difficulty: "intermediate",
    estimatedDuration: 25,
    chapterId: "ch05",
    lessonId: "ch05.regression",
    solution:
      "Ağac 18-dən sonra son yarpağın sabit qiymətini proqnozlaşdırır, yəni ekstrapolyasiya etmir. Xətti model meyli davam etdirir, polinom isə tez-tez “partlayır”. Heç bir model məlumatın olmadığı yerdə etibarlı deyil. Ağac ən azı təlim qiymətləri aralığından kənara çıxmır.",
  },
  {
    id: "ch05.ex.vote",
    title: "Kiçik meşə: səsvermə",
    prompt:
      "ch05.ex.tune-tree tapşırığının məlumatından istifadə edin. Təlim dəstindən hər biri 100 nümunədən ibarət 1000 təsadüfi alt-nümunə götürün (ShuffleSplit). Hər birində ən yaxşı hiperparametrlərlə ağac öyrədin. Ayrı-ayrı ağacların orta test dəqiqliyini ölçün. Sonra hər test nümunəsi üçün 1000 ağacın səsverməsi ilə qərar verin (scipy.stats.mode). Səsvermə dəqiqliyi necə dəyişdi? Bu, Fəsil 6-nın əsas ideyasıdır.",
    kind: "coding",
    difficulty: "advanced",
    estimatedDuration: 40,
    chapterId: "ch05",
    lessonId: "ch05.limitations",
    hints: ["Kiçik alt-nümunələrdə hər ağac zəifdir (~80%), lakin səsvermə ilə nəticə yaxşılaşır."],
  },
];
