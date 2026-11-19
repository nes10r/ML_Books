import type { z } from "zod";
import type { exerciseSchema } from "@/lib/schemas";

export const chapter06Exercises: z.input<typeof exerciseSchema>[] = [
  {
    "id": "ch06.ex.voting",
    "title": "Müxtəliflik təcrübəsi",
    "prompt": "voting.py-də dörd modeli 4 qərar ağacı (fərqli random_state ilə) ilə əvəz edin. Səsvermə qazancı necə dəyişdi? Sonra modelləri daha fərqli seçin (məs. GaussianNB, KNN, SVC, ağac) və təkrarlayın. Nəticəni müxtəliflik baxımından izah edin.",
    "kind": "research",
    "difficulty": "intermediate",
    "estimatedDuration": 25,
    "chapterId": "ch06",
    "lessonId": "ch06.voting"
  },
  {
    "id": "ch06.ex.oob",
    "title": "OOB və test",
    "prompt": "bagging_oob.py-də n_estimators-i 10, 50, 100, 300, 1000 qiymətləri ilə sınayın. Hər biri üçün OOB və test dəqiqliyini qeyd edin. OOB nə vaxt etibarlı təxmindir? max_samples-i azaltdıqda OOB nümunələrinin sayı necə dəyişir?",
    "kind": "coding",
    "difficulty": "intermediate",
    "estimatedDuration": 25,
    "chapterId": "ch06",
    "lessonId": "ch06.bagging",
    "hints": [
      "oob_decision_function_ hər nümunə üçün OOB ehtimallarını saxlayır."
    ]
  },
  {
    "id": "ch06.ex.importance",
    "title": "Əlamət əhəmiyyəti xəritəsi",
    "prompt": "random_forest.py-dəki piksel əhəmiyyətini matplotlib ilə 8×8 istilik xəritəsi kimi çəkin (plt.imshow). Sonra eyni təcrübəni ExtraTreesClassifier ilə təkrarlayın və iki xəritəni müqayisə edin. Hansı piksellər hər iki modeldə vacibdir?",
    "kind": "coding",
    "difficulty": "beginner",
    "estimatedDuration": 20,
    "chapterId": "ch06",
    "lessonId": "ch06.random-forests"
  },
  {
    "id": "ch06.ex.gbrt",
    "title": "Qradiyent bustinqini sıfırdan yazın",
    "prompt": "DecisionTreeRegressor(max_depth=2) ilə qradiyent bustinqini əl ilə yazın: (1) başlanğıc proqnoz = orta; (2) hər addımda qalıqlara ağac öyrədin; (3) proqnoza η·ağac əlavə edin. Temperatur məlumatında 100 addımdan sonra nəticəni GradientBoostingRegressor ilə müqayisə edin.",
    "kind": "coding",
    "difficulty": "advanced",
    "estimatedDuration": 40,
    "chapterId": "ch06",
    "lessonId": "ch06.boosting",
    "hints": [
      "Qalıq = y − cari proqnoz.",
      "GradientBoostingRegressor(init=...) defolt olaraq ortadan başlayır."
    ],
    "solution": "Əl ilə yazılmış versiya eyni max_depth, η və ağac sayı ilə GradientBoostingRegressor-a çox yaxın (eyni deyil — bərabər bölgülərdə təsadüfi seçimlər fərqlənə bilər) nəticə verir."
  },
  {
    "id": "ch06.ex.stacking",
    "title": "Öz blender-inizi yazın",
    "prompt": "Təlim dəstini ikiyə bölün. Birinci hissədə 4 əsas modeli öyrədin, ikinci hissə üçün onların ehtimallarını hesablayın və bu ehtimallar üzərində logistik reqressiya (blender) öyrədin. Test dəqiqliyini StackingClassifier ilə müqayisə edin. Hansı daha yaxşıdır və niyə?",
    "kind": "coding",
    "difficulty": "advanced",
    "estimatedDuration": 35,
    "chapterId": "ch06",
    "lessonId": "ch06.stacking",
    "solution": "StackingClassifier çarpaz validasiya ilə bütün təlim dəstindən blender üçün proqnoz yaradır, “hold-out” versiyası isə məlumatın yarısını itirir. Ona görə adətən StackingClassifier bir qədər daha yaxşıdır."
  }
];
