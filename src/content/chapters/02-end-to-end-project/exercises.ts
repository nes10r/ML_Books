import type { z } from "zod";
import type { exerciseSchema } from "@/lib/schemas";

export const chapter02Exercises: z.input<typeof exerciseSchema>[] = [
  {
    id: "ch02.ex.frame-project",
    title: "Öz layihənizi çərçivəyə salın",
    prompt:
      "Bakıda taksi gedişinin qiymətini (AZN) proqnozlaşdıran sistem qurulacaq. Aşağıdakı suallara cavab verin: (1) Biznes məqsədi nə ola bilər və model nəticəsi hara ötürülür? (2) Nəzarət növü, tapşırıq tipi və öyrənmə rejimi (paket/onlayn). (3) RMSE yoxsa MAE — niyə? (4) Ən azı iki fərziyyəni yazın və onları kiminlə yoxlayacağınızı qeyd edin.",
    kind: "conceptual",
    difficulty: "beginner",
    estimatedDuration: 20,
    chapterId: "ch02",
    lessonId: "ch02.big-picture",
    hints: ["Proqnoz sürücüyə, yoxsa müştəriyə göstərilir?", "Tıxac və tətil günlərində qeyri-adi gedişlər çox olacaqmı?"],
    solution:
      "Məsələn: məqsəd gediş başlamazdan əvvəl ədalətli qiymət təklif etməkdir. Nəzarətli çoxdəyişənli reqressiya; gün ərzində məlumat çox gəldiyi üçün onlayn və ya tez-tez paket yeniləmə. Nadir, lakin çox uzun gedişlər metrikaya güclü təsir göstərməsin deyə MAE seçilə bilər. Ədalətsiz böyük səhvlər isə xüsusilə cəzalandırılmalıdırsa, RMSE seçilir. Fərziyyələr: qiymət dəqiq ədəd kimi lazımdır (kateqoriya yox) — məhsul komandası ilə yoxlanılır; hədəf tariflərə görə dəyişmir — maliyyə komandası ilə yoxlanılır.",
  },
  {
    id: "ch02.ex.first-look",
    title: "İlk baxış hesabatı",
    prompt:
      "load_and_inspect.py skriptini işlədin və 5–7 bəndlik qısa hesabat yazın: hansı sütunlarda boşluq var (faizlə)? Kateqoriyalı sütunların ən çox rast gələn qiymətləri hansılardır? Hansı ədədi sütunlarda şübhəli minimum və ya maksimum var? Sonra apartments.hist(bins=40) ilə histoqramlar çəkin və ən əyilmiş iki sütunu qeyd edin.",
    kind: "coding",
    difficulty: "beginner",
    estimatedDuration: 25,
    chapterId: "ch02",
    lessonId: "ch02.get-data",
    hints: ["apartments.isna().mean() boşluqların payını verir.", "Histoqram üçün matplotlib quraşdırılmalıdır: pip install matplotlib."],
  },
  {
    id: "ch02.ex.stable-split",
    title: "Sabit bölgünü sınayın",
    prompt:
      "test_set.py-dəki is_in_test funksiyasından istifadə edin. Məlumatın ilk 2000 sətri ilə test dəstini yaradın, sonra bütün 2400 sətirlə yenidən yaradın. Birinci test dəstindəki ID-lərin hamısının ikincidə də olduğunu kodla yoxlayın. Eyni təcrübəni train_test_split(random_state=42) ilə təkrarlayın və fərqi izah edin.",
    kind: "coding",
    difficulty: "intermediate",
    estimatedDuration: 20,
    chapterId: "ch02",
    lessonId: "ch02.test-set",
    hints: ["set(test1.id) <= set(test2.id) alt çoxluq yoxlamasıdır."],
    solution:
      "Hash bölgüsündə nümunənin test dəstinə düşüb-düşməməsi yalnız onun ID-sindən asılıdır, ona görə də köhnə test nümunələri yerində qalır. train_test_split isə sətir sayı dəyişdikdə tamamilə fərqli permutasiya yaradır. Nəticədə köhnə test nümunələrinin bir hissəsi təlimə keçir.",
  },
  {
    id: "ch02.ex.new-feature",
    title: "Faydalı əlamət tapın",
    prompt:
      "Ən azı üç yeni əlamət təklif edin və təlim dəstində qiymətlə korrelyasiyasını hesablayın. Məsələn: mərkəzə (Səbail) məsafə, “birinci və ya son mərtəbə” bayrağı, otaq sayı × təmir. Hansı əlamət ən faydalıdır? Hansı təklifiniz məlumat sızması riski daşıyır və niyə?",
    kind: "research",
    difficulty: "intermediate",
    estimatedDuration: 30,
    chapterId: "ch02",
    lessonId: "ch02.explore",
    hints: [
      "Mərkəzə məsafə: np.hypot(enlik − 40.356, (uzunluq − 49.836) · 0.76). 0.76 əmsalı Bakı enliyində uzunluq dərəcəsini qısaldır.",
      "Hədəfdən (qiymet) istifadə edən istənilən əlamət sızmadır.",
    ],
  },
  {
    id: "ch02.ex.encoding-choice",
    title: "Kodlaşdırma qərarları",
    prompt:
      "Hər sütun üçün hazırlıq strategiyasını cədvəldə yazın (boşluqlar + kodlaşdırma/miqyaslama) və qısa əsaslandırın: rayon, tikili, temir, sahe, otaq_sayi, metro_mesafe, kupca, mertebe. Sonra 'temir' sütunu üçün həm OrdinalEncoder, həm də OneHotEncoder ilə xətti reqressiyanın CV RMSE-sini müqayisə edin.",
    kind: "coding",
    difficulty: "intermediate",
    estimatedDuration: 30,
    chapterId: "ch02",
    lessonId: "ch02.prepare",
  },
  {
    id: "ch02.ex.custom-transformer",
    title: "Xüsusi transformer: mərkəzə məsafə",
    prompt:
      "DistanceToCenter adlı transformer yazın. O, enlik və uzunluq sütunlarından mərkəzə (koordinatı konstruktorda verilir) məsafəni hesablasın. BaseEstimator və TransformerMixin-dən törədin, get_feature_names_out metodunu da əlavə edin. Onu pipeline.py-dəki ColumnTransformer-ə yeni qol kimi qoşun və train_models.py ilə təsadüfi meşənin CV RMSE-sinin dəyişdiyini yoxlayın.",
    kind: "coding",
    difficulty: "intermediate",
    estimatedDuration: 40,
    chapterId: "ch02",
    lessonId: "ch02.pipelines",
    hints: ["fit() heç nə öyrənmir, sadəcə self qaytarır.", "Hiperparametrləri (mərkəz koordinatı) __init__-də saxlayın, *args istifadə etməyin."],
  },
  {
    id: "ch02.ex.compare-models",
    title: "Dördüncü model",
    prompt:
      "train_models.py-yə KNeighborsRegressor(n_neighbors=8) əlavə edin. Pipeline bütün əlamətləri standartlaşdırdığı üçün k-NN birbaşa işləyəcək. Təlim və CV RMSE-sini cədvələ əlavə edin. Nəticəni şəbəkə axtarışı simulyasiyasındakı rəqəmlərlə müqayisə edin: niyə fərqlidir?",
    kind: "coding",
    difficulty: "beginner",
    estimatedDuration: 20,
    chapterId: "ch02",
    lessonId: "ch02.train-model",
    solution:
      "Simulyasiya yalnız 5 əlamət və 1 200 mənzildən istifadə edir. Pipeline isə 20 əlamət (one-hot rayonlar, təmir və s.) və 1 920 təlim nümunəsi ilə işləyir. Fərqli əlamətlər və məlumat həcmi fərqli xəta verir.",
  },
  {
    id: "ch02.ex.search-budget",
    title: "Axtarış büdcəsi",
    prompt:
      "fine_tune.py-də RandomizedSearchCV-nin n_iter parametrini 5, 9 və 20 ilə sınayın. Hər dəfə ən yaxşı CV RMSE-ni və sərf olunan vaxtı (time.perf_counter) qeyd edin. Sonra GridSearchCV-yə model__n_estimators üçün [60, 150] əlavə edin: kombinasiyaların sayı və vaxt necə dəyişir? Nəticəni 3–4 cümlə ilə ümumiləşdirin.",
    kind: "research",
    difficulty: "intermediate",
    estimatedDuration: 30,
    chapterId: "ch02",
    lessonId: "ch02.fine-tune",
  },
  {
    id: "ch02.ex.monitoring-plan",
    title: "Monitorinq planı",
    prompt:
      "Mənzil qiyməti modeli bir əmlak saytında istifadəyə verildi. Bir səhifəlik monitorinq planı yazın: (1) hansı göstəriciləri hansı tezliklə izləyəcəksiniz, (2) real satış qiyməti gec məlum olduqda keyfiyyəti necə ölçəcəksiniz, (3) hansı hədlərdə xəbərdarlıq göndəriləcək, (4) yenidən təlim nə vaxt və necə aparılacaq, (5) geri qaytarma (rollback) proseduru.",
    kind: "conceptual",
    difficulty: "intermediate",
    estimatedDuration: 25,
    chapterId: "ch02",
    lessonId: "ch02.launch",
    hints: ["Giriş paylanmasını (məs. orta sahə, rayon payları) təlim dəsti ilə müqayisə edin.", "Elanlardakı qiymət real satış qiymətindən fərqlənə bilər."],
  },
];
