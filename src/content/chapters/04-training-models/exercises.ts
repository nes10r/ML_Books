import type { z } from "zod";
import type { exerciseSchema } from "@/lib/schemas";

export const chapter04Exercises: z.input<typeof exerciseSchema>[] = [
  {
    id: "ch04.ex.vectorize",
    title: "Dövr əvəzinə vektor",
    prompt:
      "MSE-ni iki yolla hesablayan funksiyalar yazın: (1) Python for dövrü ilə, nümunələr üzərindən; (2) NumPy ilə bir sətirdə (X_b @ theta). m = 1 000 000 nümunə üçün hər ikisinin işləmə vaxtını time.perf_counter ilə ölçün. Fərq neçə dəfədir? Nəticələrin eyni olduğunu np.isclose ilə yoxlayın.",
    kind: "coding",
    difficulty: "beginner",
    estimatedDuration: 15,
    chapterId: "ch04",
    lessonId: "ch04.linear-regression",
    hints: ["Dövr versiyasında X_b[i] @ theta hər nümunə üçün ayrıca hesablanır."],
  },
  {
    id: "ch04.ex.singular",
    title: "Singulyar matris",
    prompt:
      "X matrisinə birinci sütunun dəqiq 2 qatından ibarət ikinci sütun əlavə edin (məs. sahə m² və sahə “yarım-m²” vahidində). np.linalg.inv(X_b.T @ X_b) nə qaytarır, yoxsa xəta verir? Eyni məlumatda np.linalg.pinv və LinearRegression nəticələrini müqayisə edin. Proqnozlar eyni qalırmı, əmsallar necə bölünür?",
    kind: "coding",
    difficulty: "intermediate",
    estimatedDuration: 20,
    chapterId: "ch04",
    lessonId: "ch04.normal-equation",
    solution:
      "XᵀX singulyar olduğu üçün inv ya LinAlgError verir, ya da ədədi səhv nəticə qaytarır. pinv isə minimal normalı həlli tapır: “çəki” iki eyni əlamət arasında bölünür (θ₁ + 2θ₂ eyni qalır) və proqnozlar dəyişmir. LinearRegression da eyni nəticəni verir.",
  },
  {
    id: "ch04.ex.eta-limit",
    title: "Kritik öyrənmə sürəti",
    prompt:
      "batch_gd.py-də η qiymətlərini 0.30-dan 0.60-a qədər 0.02 addımla dəyişin və hər biri üçün yığılıb-yığılmadığını yoxlayın. Uzaqlaşmanın başladığı həddi tapın. Sonra bu həddi nəzəri olaraq hesablayın: MSE-nin Hessian matrisi H = (2/m)·X_bᵀX_b-dir, GD isə η < 2 / λ_max(H) olduqda yığılır (np.linalg.eigvalsh). İki nəticə uyğun gəlirmi?",
    kind: "coding",
    difficulty: "advanced",
    estimatedDuration: 30,
    chapterId: "ch04",
    lessonId: "ch04.gradient-descent",
    hints: ["Hessian kvadratik xərc funksiyasının “əyriliyini” ölçür.", "λ_max ən dik istiqamətdəki əyrilikdir."],
  },
  {
    id: "ch04.ex.schedule",
    title: "Öyrənmə cədvəli eksperimenti",
    prompt:
      "sgd_minibatch.py-dəki SGD-ni üç cədvəllə işlədin: (1) sabit η = 0.05, (2) t0/(t + t1), t0 = 5, t1 = 50, (3) η₀·0.9^epoxa. Hər epoxadan sonra MSE-ni yadda saxlayın və üç əyrini bir qrafikdə çəkin. Hansı cədvəl ən aşağı son xərcə çatır? Hansı ən tez sabitləşir?",
    kind: "research",
    difficulty: "intermediate",
    estimatedDuration: 25,
    chapterId: "ch04",
    lessonId: "ch04.sgd",
  },
  {
    id: "ch04.ex.learning-curve",
    title: "Öyrənmə əyrilərini oxuyun",
    prompt:
      "polynomial_learning_curves.py-ni dərəcə 1, 2, 4, 8 və 15 üçün işlədin. Hər biri üçün diaqnoz yazın (underfitting / yaxşı / overfitting) və əsaslandırın. Dərəcə 15 üçün Ridge(alpha=…) əlavə edərək validasiya xətasını dərəcə 2-nin səviyyəsinə endirməyə çalışın. Hansı α lazım oldu?",
    kind: "coding",
    difficulty: "intermediate",
    estimatedDuration: 30,
    chapterId: "ch04",
    lessonId: "ch04.polynomial",
    hints: ["make_pipeline(PolynomialFeatures(15), StandardScaler(), Ridge(alpha=...))"],
  },
  {
    id: "ch04.ex.choose-regularizer",
    title: "Requlyarlaşdırıcı seçimi",
    prompt:
      "Hər ssenari üçün Ridge, Lasso, Elastic Net və ya requlyarlaşdırmasız modeldən birini seçin və əsaslandırın: (1) 20 əlamət, hamısı mənalı, məlumat azdır; (2) 500 əlamət, yalnız bir neçəsinin faydalı olduğu gözlənilir; (3) 500 əlamət, faydalı olanlar bir-biri ilə güclü korrelyasiyalıdır; (4) 3 əlamət, 1 milyon nümunə.",
    kind: "conceptual",
    difficulty: "intermediate",
    estimatedDuration: 15,
    chapterId: "ch04",
    lessonId: "ch04.regularization",
    solution:
      "(1) Ridge — bütün əlamətləri saxlayır, az məlumatda dispersiyanı azaldır. (2) Lasso — avtomatik əlamət seçimi. (3) Elastic Net — korrelyasiyalı qruplarda Lasso təsadüfi birini seçir və qeyri-sabitdir, Elastic Net isə daha sabitdir. (4) Requlyarlaşdırma demək olar ki, lazım deyil — çoxlu məlumat və sadə model overfitting riskini azaldır (yenə də az miqdarda Ridge zərər vermir).",
  },
  {
    id: "ch04.ex.boundary",
    title: "Qərar sərhədini çəkin",
    prompt:
      "logistic_regression.py-dəki modelin qərar sərhədini (θ₀ + θ₁·oxuma + θ₂·yuxu = 0) matplotlib ilə məlumatın üzərində çəkin. Sonra p = 0.1 və p = 0.9 xətlərini də əlavə edin (logit = ln(p/(1−p))). C = 0.01 üçün eyni qrafiki təkrarlayın: xətlər arasındakı məsafə necə dəyişdi və niyə?",
    kind: "coding",
    difficulty: "intermediate",
    estimatedDuration: 30,
    chapterId: "ch04",
    lessonId: "ch04.logistic",
    hints: ["Sərhəddə yuxu = −(θ₀ + θ₁·oxuma − logit) / θ₂."],
    solution: "Güclü requlyarlaşdırma (kiçik C) əmsalları kiçildir: sigmoid daha “yastı” olur və p = 0.1 ilə 0.9 xətləri bir-birindən uzaqlaşır. Model daha az əmin olur.",
  },
  {
    id: "ch04.ex.softmax-scratch",
    title: "Softmax-ı sıfırdan yazın",
    prompt:
      "Yalnız NumPy ilə softmax reqressiyasını mini-paket qradiyent enmə və erkən dayandırma ilə yazın: softmax funksiyası, çarpaz entropiya, qradiyent ∇θₖ = (1/m) Σ (p̂ₖ − yₖ) x. Şərab dəstində (standartlaşdırılmış) öyrədin və nəticəni LogisticRegression ilə müqayisə edin.",
    kind: "coding",
    difficulty: "advanced",
    estimatedDuration: 60,
    chapterId: "ch04",
    lessonId: "ch04.softmax",
    hints: [
      "Ədədi sabitlik üçün softmax-dan əvvəl hər sətirdən maksimumu çıxın.",
      "Etiketləri one-hot matrisə çevirin: np.eye(K)[y].",
    ],
  },
];
