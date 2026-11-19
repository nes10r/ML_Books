import type { z } from "zod";
import type { codeExampleSchema, mediaAssetSchema } from "@/lib/schemas";

const dir = "chapters/02-end-to-end-project/code";

/** Expected outputs were produced with Python 3.11, numpy 2.4, pandas 2.3, scikit-learn 1.8. */
export const chapter02CodeExamples: z.input<typeof codeExampleSchema>[] = [
  {
    id: "ch02.code.load-inspect",
    title: "Məlumatı yükləmək və ilk baxış",
    description: "pandas ilə CSV faylını oxumaq, sütun tiplərini, boşluqları, kateqoriyaları və ədədi xülasəni görmək.",
    language: "python",
    file: `${dir}/load_and_inspect.py`,
    expectedOutput: `Ölçü (sətir, sütun): (2400, 13)
   id      rayon     enlik   uzunluq   sahe  otaq_sayi  mertebe  bina_mertebe tikili temir  metro_mesafe  kupca  qiymet
0   1     Nəsimi  40.37242  49.84674   47.4        1.0        3             5  köhnə  orta          1.38      1  139800
1   2     Nizami  40.41485  49.94368  129.4        4.0       10            12   yeni   NaN          2.51      1  211600
2   3  Nərimanov  40.42390  49.86090   71.5        3.0        8            13   yeni   əla           NaN      1  207200

Sütun tipləri və boş olmayan qiymətlər:
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 2400 entries, 0 to 2399
Data columns (total 13 columns):
 #   Column        Non-Null Count  Dtype  
---  ------        --------------  -----  
 0   id            2400 non-null   int64  
 1   rayon         2400 non-null   object 
 2   enlik         2400 non-null   float64
 3   uzunluq       2400 non-null   float64
 4   sahe          2400 non-null   float64
 5   otaq_sayi     2352 non-null   float64
 6   mertebe       2400 non-null   int64  
 7   bina_mertebe  2400 non-null   int64  
 8   tikili        2400 non-null   object 
 9   temir         2326 non-null   object 
 10  metro_mesafe  2289 non-null   float64
 11  kupca         2400 non-null   int64  
 12  qiymet        2400 non-null   int64  
dtypes: float64(5), int64(5), object(3)
memory usage: 243.9+ KB

Çatışmayan qiymətlər:
otaq_sayi        48
temir            74
metro_mesafe    111

Kateqoriyalı sütunlar:
rayon
Yasamal      344
Nəsimi       325
Xətai        301
Nərimanov    299
Binəqədi     253
Nizami       246
Səbail       187
Sabunçu      166
Xəzər        152
Suraxanı     127 

tikili
yeni     1305
köhnə    1095 

temir
orta        893
təmirsiz    728
əla         705
NaN          74 

Ədədi xülasə:
         sahe  otaq_sayi  metro_mesafe    qiymet
count  2400.0     2352.0        2289.0    2400.0
mean     82.9        2.7           2.0  163733.6
std      55.5        1.1           2.5   91907.1
min      26.9        1.0           0.0   20300.0
25%      59.6        2.0           0.6   96800.0
50%      74.8        3.0           1.2  144150.0
75%      96.2        3.0           2.3  209825.0
max    1486.0        6.0          28.4  919200.0`,
    chapterId: "ch02",
    lessonId: "ch02.get-data",
    libraries: ["pandas"],
  },
  {
    id: "ch02.code.test-set",
    title: "Test dəstinin üç üsulla yaradılması",
    description: "Təsadüfi, hash əsaslı və stratifikasiyalı bölgülərin rayon paylarına görə müqayisəsi.",
    language: "python",
    file: `${dir}/test_set.py`,
    expectedOutput: `           ümumi %  təsadüfi %  stratifik %  təsadüfi xəta  stratifik xəta
rayon                                                                     
Binəqədi     10.54       11.25        10.62           0.71            0.08
Nizami       10.25       10.62        10.21           0.37            0.04
Nərimanov    12.46       12.71        12.50           0.25            0.04
Nəsimi       13.54       14.79        13.54           1.25            0.00
Sabunçu       6.92        5.42         6.88           1.50            0.04
Suraxanı      5.29        4.38         5.21           0.91            0.08
Səbail        7.79        8.54         7.92           0.75            0.13
Xətai        12.54       11.46        12.50           1.08            0.04
Xəzər         6.33        6.46         6.25           0.13            0.08
Yasamal      14.33       14.37        14.37           0.04            0.04

Hash bölgüsündə test ölçüsü: 481 (20.0%)`,
    chapterId: "ch02",
    lessonId: "ch02.test-set",
    libraries: ["numpy", "pandas", "scikit-learn"],
  },
  {
    id: "ch02.code.explore",
    title: "Kəşf: korrelyasiyalar və şübhəli sətirlər",
    description: "Təlim dəstində korrelyasiyaları ölçmək, yazı səhvlərini tapmaq və birləşmiş əlamətləri sınamaq.",
    language: "python",
    file: `${dir}/explore.py`,
    expectedOutput: `Qiymət ilə korrelyasiya (təmizləmədən əvvəl):
qiymet          1.000
otaq_sayi       0.570
sahe            0.418
bina_mertebe    0.256
mertebe         0.190
kupca           0.038
metro_mesafe   -0.388
uzunluq        -0.402
enlik          -0.492

Şübhəli sahə qiymətləri: 4 sətir
         rayon    sahe  otaq_sayi  qiymet
2176  Binəqədi   992.0        3.0  105500
1308  Suraxanı   561.0        2.0   66700
380     Səbail  1001.0        3.0  254400
2238    Nəsimi  1130.0        4.0  407700

sahe–qiymət korrelyasiyası: əvvəl 0.418, sonra 0.656

Yeni əlamətlərin qiymət ilə korrelyasiyası:
sahe               0.656
otaq_sahesi       -0.041
mertebe_nisbeti    0.008
metro_mesafe      -0.388
qiymet             1.000

Rayonlar üzrə 1 m²-in median qiyməti (AZN):
rayon
Suraxanı      989.0
Xəzər        1032.0
Sabunçu      1053.0
Binəqədi     1340.0
Nizami       1703.0
Xətai        1909.0
Nərimanov    2213.0
Yasamal      2384.0
Nəsimi       2854.0
Səbail       3157.0`,
    chapterId: "ch02",
    lessonId: "ch02.explore",
    libraries: ["pandas", "scikit-learn"],
  },
  {
    id: "ch02.code.prepare",
    title: "Hazırlıq: imputer, kodlaşdırıcılar və miqyaslayıcılar",
    description: "SimpleImputer, OrdinalEncoder, OneHotEncoder və miqyaslama üsullarının ayrı-ayrılıqda tətbiqi.",
    language: "python",
    file: `${dir}/prepare.py`,
    expectedOutput: `Öyrənilmiş medianlar: {'otaq_sayi': np.float64(3.0), 'metro_mesafe': np.float64(1.21)}
Doldurulandan sonra boşluq sayı: 0

Təmir kodları: [1. 1. 2. 0. 1.] ← ['orta', 'orta', 'əla', 'təmirsiz', 'orta']

One-hot matrisi: (2400, 10) (seyrək: csr_matrix)
Sütunlar: ['rayon_Binəqədi', 'rayon_Nizami', 'rayon_Nərimanov', 'rayon_Nəsimi'] ...
        min-max: min=  0.00 max=  1.00 orta= 0.15 əyilmə= 2.95
       standart: min= -1.61 max=  9.42 orta= 0.00 əyilmə= 2.95
 log + standart: min= -2.91 max=  4.64 orta=-0.00 əyilmə= 0.38`,
    chapterId: "ch02",
    lessonId: "ch02.prepare",
    libraries: ["numpy", "pandas", "scikit-learn"],
  },
  {
    id: "ch02.code.pipeline",
    title: "Tam hazırlıq pipeline-ı",
    description: "Xüsusi transformer, FunctionTransformer, Pipeline və ColumnTransformer ilə bütün hazırlığı bir obyektə yığmaq. Növbəti skriptlər bu faylı idxal edir.",
    language: "python",
    file: `${dir}/pipeline.py`,
    expectedOutput: `Hazırlanmış matris: (2400, 20)
Əlamət adları:
   sahe__sahe
   mertebe_nisbeti__nisbet
   say__otaq_sayi
   say__metro_mesafe
   say__enlik
   say__uzunluq
   temir__temir
   kateqoriya__rayon_Binəqədi
   kateqoriya__rayon_Nizami
   kateqoriya__rayon_Nərimanov
   kateqoriya__rayon_Nəsimi
   kateqoriya__rayon_Sabunçu
   kateqoriya__rayon_Suraxanı
   kateqoriya__rayon_Səbail
   kateqoriya__rayon_Xətai
   kateqoriya__rayon_Xəzər
   kateqoriya__rayon_Yasamal
   kateqoriya__tikili_köhnə
   kateqoriya__tikili_yeni
   remainder__kupca`,
    chapterId: "ch02",
    lessonId: "ch02.pipelines",
    libraries: ["numpy", "pandas", "scikit-learn"],
  },
  {
    id: "ch02.code.train",
    title: "Üç modelin təlimi və müqayisəsi",
    description: "Xətti reqressiya, qərar ağacı və təsadüfi meşənin təlim və 10 qatlı CV xətaları. pipeline.py faylı eyni qovluqda olmalıdır.",
    language: "python",
    file: `${dir}/train_models.py`,
    expectedOutput: `model               təlim RMSE     CV RMSE (10 qat)
Xətti reqressiya        34,600       34,457 ± 7,436
Qərar ağacı                  0       40,498 ± 7,481
Təsadüfi meşə           11,296       30,569 ± 6,638`,
    chapterId: "ch02",
    lessonId: "ch02.train-model",
    libraries: ["pandas", "scikit-learn"],
  },
  {
    id: "ch02.code.fine-tune",
    title: "Hiperparametr axtarışı və yekun test",
    description: "GridSearchCV, RandomizedSearchCV, əlamət əhəmiyyəti və test RMSE-si üçün 95% etibarlılıq intervalı. pipeline.py faylı eyni qovluqda olmalıdır.",
    language: "python",
    file: `${dir}/fine_tune.py`,
    expectedOutput: `Ən yaxşı (grid): {'model__max_features': 8, 'model__min_samples_leaf': 3} CV RMSE = 31,711
Ən yaxşı (random): {'model__max_features': 9, 'model__min_samples_leaf': 3} CV RMSE = 32,188

Ən vacib 6 əlamət:
  sahe__sahe                       0.372
  say__enlik                       0.172
  say__uzunluq                     0.118
  say__otaq_sayi                   0.102
  say__metro_mesafe                0.071
  kateqoriya__rayon_Səbail         0.036

Test RMSE = 29,275 AZN  (95% interval: 24,759 – 33,181)`,
    chapterId: "ch02",
    lessonId: "ch02.fine-tune",
    libraries: ["numpy", "pandas", "scipy", "scikit-learn"],
  },
  {
    id: "ch02.code.save-model",
    title: "Modelin saxlanması və yenidən yüklənməsi",
    description: "Yekun modeli joblib ilə saxlamaq, yükləmək və yeni mənzil üçün proqnoz vermək. pipeline.py faylı eyni qovluqda olmalıdır.",
    language: "python",
    file: `${dir}/save_model.py`,
    expectedOutput: `Model saxlanıldı: baku_apartment_model.pkl
Proqnoz: 242,266 AZN`,
    chapterId: "ch02",
    lessonId: "ch02.launch",
    libraries: ["joblib", "pandas", "scikit-learn"],
  },
];

export const chapter02Media: z.input<typeof mediaAssetSchema>[] = [
  {
    id: "ch02.media.project-checklist",
    type: "image",
    title: "ML layihəsinin mərhələləri",
    src: "/media/ch02/project-checklist.svg",
    alt: "Səkkiz mərhələdən ibarət dairəvi axın: problemin qoyuluşu, məlumatın əldə edilməsi, kəşf, hazırlıq, model seçimi, dəqiqləşdirmə, təqdimat, istifadəyə vermə və monitorinq; monitorinqdən yenidən məlumata qayıdan ox.",
    width: 960,
    height: 420,
    caption: "Bu fəslin dərsləri bu mərhələləri ardıcıl izləyir. Real layihədə dövr təkrarlanır: monitorinq yeni məlumat və yeni suallar doğurur.",
    credit: "Platforma üçün orijinal diaqram",
    license: "CC BY 4.0",
    chapterId: "ch02",
  },
  {
    id: "ch02.media.preprocessing-pipeline",
    type: "image",
    title: "ColumnTransformer ilə hazırlıq pipeline-ı",
    src: "/media/ch02/preprocessing-pipeline.svg",
    alt: "Xam cədvəl sütun qruplarına bölünür: sahə (səhv düzəltmə, log, standartlaşdırma), mərtəbə nisbəti, ədədi sütunlar (median, standartlaşdırma), təmir (sıralı kodlaşdırma), rayon və tikili (one-hot). Bütün qolların nəticəsi birləşdirilib modelə verilir.",
    width: 960,
    height: 440,
    caption: "Hər sütun qrupu öz emal zəncirindən keçir; ColumnTransformer nəticələri yan-yana birləşdirir.",
    credit: "Platforma üçün orijinal diaqram",
    license: "CC BY 4.0",
    chapterId: "ch02",
  },
];
