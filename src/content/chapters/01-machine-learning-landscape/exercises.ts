import type { z } from "zod";
import type { exerciseSchema } from "@/lib/schemas";

export const chapter01Exercises: z.input<typeof exerciseSchema>[] = [
  {
    id: "ch01.ex.rules-vs-learning",
    title: "Qaydalar, yoxsa öyrənmə?",
    prompt:
      "Bir onlayn mağaza məhsul rəylərini “müsbət” və “mənfi” kimi ayırmaq istəyir. Əvvəlcə bu problemi həll edən 5 əl ilə yazılmış qayda tərtib edin (məsələn “əla” sözü varsa → müsbət). Sonra bu qaydaların hansı hallarda səhv edəcəyini göstərən ən azı 3 rəy nümunəsi yazın. Nəhayət, ML yanaşmasının bu problemi necə fərqli həll edəcəyini 3–4 cümlə ilə izah edin.",
    kind: "conceptual",
    difficulty: "beginner",
    estimatedDuration: 15,
    chapterId: "ch01",
    lessonId: "ch01.what-is-ml",
    hints: ["İnkar formalarını düşünün: “heç də əla deyil”.", "Sarkazm və istehza qaydalar üçün ən çətin haldır."],
    solution:
      "Qaydalar açar sözlərə əsaslanır və kontekstdən xəbərsizdir: inkar, sarkazm, yazım səhvləri və yeni ifadələr onları sındırır. ML yanaşmasında minlərlə etiketli rəydən hansı söz birləşmələrinin hansı sinifə işarə etdiyi avtomatik öyrənilir, yeni məlumatla model yenidən öyrədilərək təkmilləşdirilir.",
  },
  {
    id: "ch01.ex.problem-framing",
    title: "Problemi ML tapşırığına çevirin",
    prompt:
      "Aşağıdakı hər bir ssenari üçün tapşırıq növünü (təsnifat, reqressiya, klasterləşdirmə, anomaliya aşkarlanması, tövsiyə) və uyğun nəzarət növünü müəyyən edin: (1) taksi gediş haqqının proqnozu; (2) xəstəxana qəbullarında qeyri-adi artımın aşkarlanması; (3) xəbər məqalələrinin mövzulara görə avtomatik qruplaşdırılması (mövzular əvvəlcədən məlum deyil); (4) kredit müraciətinin təsdiq/rədd edilməsi.",
    kind: "conceptual",
    difficulty: "beginner",
    estimatedDuration: 10,
    chapterId: "ch01",
    lessonId: "ch01.applications",
    solution: "(1) Reqressiya, nəzarətli. (2) Anomaliya aşkarlanması, adətən nəzarətsiz. (3) Klasterləşdirmə, nəzarətsiz. (4) İkili təsnifat, nəzarətli.",
  },
  {
    id: "ch01.ex.pick-supervision",
    title: "Etiket büdcəsi",
    prompt:
      "Bir startapda 200 000 tibbi rentgen şəkli var, lakin radioloqlar yalnız 1 000-ni etiketləyə bilər. Hansı öyrənmə növlərini birləşdirərdiniz və niyə? Simulyasiyada gördüyünüz klasterləşdirmə ideyası burada necə kömək edə bilər?",
    kind: "conceptual",
    difficulty: "intermediate",
    estimatedDuration: 15,
    chapterId: "ch01",
    lessonId: "ch01.training-supervision",
    hints: ["Etiketsiz şəkillərdən necə fayda götürmək olar?", "Öz-özünə nəzarətli ön təlimi düşünün."],
    solution:
      "Etiketsiz 199 000 şəkil üzərində öz-özünə nəzarətli ön təlim (və ya klasterləşdirmə) faydalı təmsillər öyrədir. Sonra 1 000 etiketli şəkil ilə nəzarətli incə tənzimləmə aparılır. Klasterləşdirmə həm də radioloqların hansı şəkilləri etiketləməsinin daha faydalı olacağını seçməyə kömək edə bilər (hər klasterdən nümunələr).",
  },
  {
    id: "ch01.ex.learning-rate",
    title: "Öyrənmə sürəti eksperimenti",
    prompt:
      "Onlayn öyrənmə simulyasiyasında üç öyrənmə sürəti ilə (0.02, 0.2, 1.5) hər dəfə 100 nümunə işlədin. Hər hal üçün xəttin sabitliyini və konsept sürüşməsindən sonra bərpa sürətini qeyd edin. Nəticələri qısa cədvəldə ümumiləşdirin.",
    kind: "research",
    difficulty: "beginner",
    estimatedDuration: 15,
    chapterId: "ch01",
    lessonId: "ch01.batch-online",
  },
  {
    id: "ch01.ex.manual-regression",
    title: "Xətti reqressiyanı əl ilə hesablayın",
    prompt:
      "Üç mənzil verilib: (50 m², 95 min ₼), (80 m², 140 min ₼), (110 m², 175 min ₼). Ən kiçik kvadratlar düsturları ilə θ₁ və θ₀-ı əl ilə hesablayın, sonra 95 m²-lik mənzilin qiymətini proqnozlaşdırın. Cavabınızı Python kodu ilə yoxlayın.",
    kind: "coding",
    difficulty: "beginner",
    estimatedDuration: 20,
    chapterId: "ch01",
    lessonId: "ch01.instance-model",
    hints: ["Əvvəlcə x və y-in orta qiymətlərini tapın.", "θ₁ = Σ(xᵢ − x̄)(yᵢ − ȳ) / Σ(xᵢ − x̄)²"],
    solution: "x̄ = 80, ȳ ≈ 136.67. Σ(x−x̄)(y−ȳ) = 2400, Σ(x−x̄)² = 1800 → θ₁ ≈ 1.333, θ₀ ≈ 30.0. Proqnoz: 30 + 1.333·95 ≈ 156.7 min ₼.",
  },
  {
    id: "ch01.ex.knn-k",
    title: "k-nın seçimi",
    prompt:
      "Python laboratoriyasındakı ilk model kodunu götürün və KNeighborsRegressor üçün k = 1, 3, 7, 15 qiymətləri ilə 100 m² mənzilin proqnozunu hesablayın. k artdıqca proqnoz necə dəyişir? Çox böyük k (məsələn bütün nümunələrin sayı) nə ilə nəticələnir?",
    kind: "coding",
    difficulty: "beginner",
    estimatedDuration: 15,
    chapterId: "ch01",
    lessonId: "ch01.instance-model",
    solution: "k artdıqca proqnoz hamarlaşır və küyə daha az həssas olur. k = n olduqda model hər giriş üçün eyni qiyməti — bütün hədəflərin ortasını qaytarır (ağır underfitting).",
  },
  {
    id: "ch01.ex.diagnose",
    title: "Diaqnoz qoyun",
    prompt:
      "Üç komanda nəticələrini bildirir: A — təlim xətası 2%, validasiya xətası 25%; B — təlim xətası 18%, validasiya xətası 19%; C — təlim xətası 4%, validasiya xətası 5%, lakin istifadəçilərdə xəta 22%. Hər komandanın probleminin adını qoyun və iki konkret həll yolu təklif edin.",
    kind: "conceptual",
    difficulty: "intermediate",
    estimatedDuration: 15,
    chapterId: "ch01",
    lessonId: "ch01.challenges",
    solution:
      "A — overfitting: daha çox məlumat, requlyarlaşdırma, sadə model. B — underfitting: daha güclü model, daha yaxşı əlamətlər, requlyarlaşdırmanı azaltmaq. C — məlumat uyğunsuzluğu (və ya istifadə zamanı məlumatın dəyişməsi): istifadə mühitindən məlumat toplamaq, train-dev dəsti ilə yoxlamaq, monitorinq qurmaq.",
  },
  {
    id: "ch01.ex.test-set-leak",
    title: "Test dəsti sızması",
    prompt:
      "Bir tələbə 50 fərqli model sınayır və hər birini test dəstində yoxlayıb ən yaxşısını seçir. Test dəqiqliyi 94%-dir. Bu rəqəmə niyə etibar etmək olmaz? Prosesi validasiya dəsti və ya çarpaz validasiya ilə necə düzgün qurardınız? Addımları ardıcıl yazın.",
    kind: "conceptual",
    difficulty: "beginner",
    estimatedDuration: 10,
    chapterId: "ch01",
    lessonId: "ch01.testing-validating",
    solution:
      "Model seçimi test dəstinə görə edildiyi üçün test dəsti faktiki olaraq təlimin bir hissəsinə çevrilib. Doğru proses: məlumatı təlim və test hissəsinə böl → təlim hissəsində çarpaz validasiya ilə modelləri müqayisə et → ən yaxşı modeli bütün təlim hissəsində yenidən öyrət → test dəstində yalnız bir dəfə qiymətləndir.",
  },
];
