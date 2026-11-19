import type { z } from "zod";
import type { exerciseSchema } from "@/lib/schemas";

export const chapter03Exercises: z.input<typeof exerciseSchema>[] = [
  {
    id: "ch03.ex.average-digit",
    title: "“Orta” rəqəm",
    prompt:
      "Təlim dəstində hər rəqəm üçün bütün şəkillərin piksel-piksel ortasını hesablayın (10 “orta şəkil”). Onları load_digits_data.py-dəki mətn qrafikası ilə çap edin. Sonra yeni şəkli ən yaxın “orta şəklin” sinfinə aid edən sadə təsnifatçı yazın və test dəstində dəqiqliyini ölçün. Bu, Fəsil 1-dəki hansı alqoritmdir?",
    kind: "coding",
    difficulty: "beginner",
    estimatedDuration: 25,
    chapterId: "ch03",
    lessonId: "ch03.digits",
    hints: ["X_train[y_train == d].mean(axis=0) — d rəqəminin orta şəkli.", "Məsafə üçün np.linalg.norm istifadə edin."],
    solution:
      "Bu, “ən yaxın mərkəz” (nearest centroid) təsnifatçısıdır — Fəsil 1-in simulyasiyasındakı nəzarətli rejim. Scikit-Learn-də hazır NearestCentroid sinfi var. Bu sadə modelin test dəqiqliyi ≈0.88-dir, SGD-nin isə ≈0.92. Yəni ondan aşağıdır, lakin çox sürətlidir və yaxşı bir bazadır.",
  },
  {
    id: "ch03.ex.baseline",
    title: "Baza modelləri",
    prompt:
      "DummyClassifier-in strategy parametrini \"most_frequent\", \"stratified\" və \"uniform\" qiymətləri ilə sınayın. 5 detektoru üçün hər birinin dəqiqliyini, precision və recall-unu hesablayın. Hansı baza model hansı metrikanı “aldadır”? Nəticəni cədvəl şəklində yazın.",
    kind: "coding",
    difficulty: "beginner",
    estimatedDuration: 20,
    chapterId: "ch03",
    lessonId: "ch03.binary",
    hints: ["precision_score-da zero_division=0 parametri xəbərdarlığın qarşısını alır."],
  },
  {
    id: "ch03.ex.which-metric",
    title: "Hansı metrika?",
    prompt:
      "Hər ssenari üçün precision və ya recall-a üstünlük verib-verməyəcəyinizi seçin və bir cümlə ilə əsaslandırın: (1) bank əməliyyatlarında saxtakarlıq xəbərdarlığı (hər xəbərdarlığı operator yoxlayır); (2) e-poçt spam filtri; (3) mağaza oğurluğu kameraları; (4) axtarış sistemində ilk 10 nəticə; (5) nadir genetik xəstəlik üçün ilkin test.",
    kind: "conceptual",
    difficulty: "beginner",
    estimatedDuration: 15,
    chapterId: "ch03",
    lessonId: "ch03.confusion",
    solution:
      "(1) Recall — saxtakarlığı buraxmaq bahadır, operatorlar yanlış həyəcanları süzə bilər (amma həddən çox yanlış həyəcan operatorları yorur). (2) Precision — vacib məktubun spama düşməsi daha pisdir. (3) Recall — oğurluqların çoxunu tutmaq vacibdir, mühafizəçi yanlış həyəcanı yoxlayır. (4) Precision — istifadəçi yalnız ilk nəticələrə baxır, onlar uyğun olmalıdır. (5) Recall — ilkin test xəstəni buraxmamalıdır, müsbət nəticələr dəqiq testlə təsdiqlənir.",
  },
  {
    id: "ch03.ex.choose-threshold",
    title: "Recall ≥ 95% üçün hədd",
    prompt:
      "threshold_tradeoff.py-ni dəyişin: precision əvəzinə recall ≥ 95% verən ən böyük həddi tapın. Həmin hədddə precision nə qədərdir? Sonra eyni tələbi təsadüfi meşənin ehtimalları (predict_proba) üçün təkrarlayın. Nəticəni qərar həddi simulyasiyasındakı rəqəmlərlə müqayisə edin.",
    kind: "coding",
    difficulty: "intermediate",
    estimatedDuration: 25,
    chapterId: "ch03",
    lessonId: "ch03.precision-recall",
    hints: ["precision_recall_curve recall-u azalan sıra ilə qaytarır.", "recalls[:-1] >= 0.95 şərtini ödəyən ən son indeksi tapın."],
  },
  {
    id: "ch03.ex.auc-meaning",
    title: "AUC ehtimal kimi",
    prompt:
      "AUC təsadüfi seçilmiş müsbət nümunənin təsadüfi seçilmiş mənfi nümunədən daha yüksək bal alma ehtimalına bərabərdir. Bunu yoxlayın: SGD balları üzərində 100 000 təsadüfi (müsbət, mənfi) cüt seçin və müsbətin balının böyük olduğu cütlərin payını hesablayın. Nəticəni roc_auc_score ilə müqayisə edin.",
    kind: "coding",
    difficulty: "intermediate",
    estimatedDuration: 20,
    chapterId: "ch03",
    lessonId: "ch03.roc",
    hints: ["rng.choice(scores[y], 100_000) və rng.choice(scores[~y], 100_000)."],
    solution: "Pay roc_auc_score-a (≈0.981) çox yaxın çıxır; fərq yalnız təsadüfi seçmə küyüdür. Bərabər ballar yarım xal kimi sayılmalıdır.",
  },
  {
    id: "ch03.ex.ovo-count",
    title: "OvR, yoxsa OvO?",
    prompt:
      "OneVsOneClassifier və OneVsRestClassifier ilə SGDClassifier-i (StandardScaler ilə) bükün. Hər ikisinin çarpaz validasiya dəqiqliyini və öyrənmə vaxtını (time.perf_counter) ölçün. estimators_ atributunda neçə təsnifatçı olduğunu yoxlayın. Hansı strategiya bu məlumatda daha sərfəlidir?",
    kind: "coding",
    difficulty: "intermediate",
    estimatedDuration: 25,
    chapterId: "ch03",
    lessonId: "ch03.multiclass",
  },
  {
    id: "ch03.ex.augmentation",
    title: "Sürüşdürmə ilə məlumat artırma",
    prompt:
      "Hər təlim şəklini bir piksel sola, sağa, yuxarı və aşağı sürüşdürən funksiya yazın (np.roll + kənarı sıfırlamaq və ya scipy.ndimage.shift). Təlim dəstini 5 dəfə böyüdün. Ən yaxşı modeli (məs. KNeighborsClassifier) həm orijinal, həm də artırılmış dəstdə öyrədib test dəqiqliyini müqayisə edin. Qarışıqlıq matrisində hansı cütlərin səhvi azaldı?",
    kind: "coding",
    difficulty: "intermediate",
    estimatedDuration: 40,
    chapterId: "ch03",
    lessonId: "ch03.error-analysis",
    hints: ["Şəkli əvvəlcə 8×8 formasına salın, sürüşdürün, sonra yenidən 64-ə açın.", "Test dəstinə augmentation tətbiq etməyin."],
  },
  {
    id: "ch03.ex.chain",
    title: "Təsnifatçı zənciri",
    prompt:
      "Üç etiket yaradın: “böyük (≥7)”, “tək”, “sadə ədəd (2, 3, 5, 7)”. MultiOutputClassifier(LogisticRegression) və ClassifierChain(LogisticRegression) modellərini müqayisə edin (macro F1, 3 qatlı CV). Zəncir etiketlər arasındakı əlaqədən fayda götürdümü? Zəncirdə etiketlərin sırasını dəyişib nəticəni yenidən yoxlayın.",
    kind: "coding",
    difficulty: "advanced",
    estimatedDuration: 35,
    chapterId: "ch03",
    lessonId: "ch03.multilabel",
    hints: ["ClassifierChain(..., order=[2, 0, 1]) sıranı dəyişir.", "LogisticRegression üçün StandardScaler əlavə edin və max_iter-i artırın."],
  },
];
