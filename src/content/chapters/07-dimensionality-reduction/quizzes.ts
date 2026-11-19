import type { z } from "zod";
import type { quizSchema } from "@/lib/schemas";

export const chapter07Quizzes: z.input<typeof quizSchema>[] = [
  {
    "id": "ch07.quiz.curse",
    "title": "Bilik yoxlaması: ölçü lənəti",
    "description": "Yüksək ölçülü fəza.",
    "chapterId": "ch07",
    "lessonId": "ch07.curse",
    "questions": [
      {
        "id": "q1",
        "type": "single-choice",
        "prompt": "10 000 ölçülü vahid hiperkubda təsadüfi nöqtə üçün ən yaxın və ən uzaq qonşu məsafələrinin nisbəti təxminən 0.97 çıxdı. Bu nə deməkdir?",
        "options": [
          {
            "id": "a",
            "text": "Məsafələr demək olar ki, eynidir — “ən yaxın qonşu” anlayışı mənasını itirir"
          },
          {
            "id": "b",
            "text": "Nöqtələr bir-birinə çox yaxındır"
          },
          {
            "id": "c",
            "text": "Hesablamada səhv var"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Məsafələrin konsentrasiyası məsafəyə əsaslanan alqoritmləri zəiflədir."
      },
      {
        "id": "q2",
        "type": "true-false",
        "prompt": "Yüksək ölçüdə eyni sıxlığı saxlamaq üçün lazım olan təlim nümunələrinin sayı ölçü ilə eksponensial artır.",
        "answer": true,
        "explanation": "Ölçü lənətinin əsas praktiki nəticəsi budur."
      },
      {
        "id": "q3",
        "type": "single-choice",
        "prompt": "İsveçrə rulonunu PCA ilə müstəviyə proyeksiya etsək nə olur?",
        "options": [
          {
            "id": "a",
            "text": "Rulonun qatları üst-üstə düşür"
          },
          {
            "id": "b",
            "text": "Rulon mükəmməl açılır"
          },
          {
            "id": "c",
            "text": "Heç nə dəyişmir"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Əyilmiş manifold üçün xətti proyeksiya uyğun deyil."
      }
    ]
  },
  {
    "id": "ch07.quiz.pca",
    "title": "Bilik yoxlaması: PCA",
    "description": "Əsas komponentlər.",
    "chapterId": "ch07",
    "lessonId": "ch07.pca",
    "questions": [
      {
        "id": "q1",
        "type": "single-choice",
        "prompt": "PCA birinci əsas komponent kimi hansı oxu seçir?",
        "options": [
          {
            "id": "a",
            "text": "Proyeksiya olunmuş məlumatın dispersiyasını maksimum edən oxu"
          },
          {
            "id": "b",
            "text": "Birinci əlamətin oxunu"
          },
          {
            "id": "c",
            "text": "Təsadüfi oxu"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Bu, eyni zamanda nöqtələrlə proyeksiyaları arasındakı orta kvadrat məsafəni minimallaşdıran oxdur."
      },
      {
        "id": "q2",
        "type": "true-false",
        "prompt": "PCA məlumatın mərkəzləşdirilməsini (ortanın çıxılmasını) tələb edir; Scikit-Learn-in PCA sinfi bunu avtomatik edir.",
        "answer": true,
        "explanation": "SVD-ni əl ilə hesablayarkən ortanı özünüz çıxmalısınız."
      },
      {
        "id": "q3",
        "type": "single-choice",
        "prompt": "Bu fəsildə 3D məlumatın iki komponenti dispersiyanın 99.8%-ni saxladı. Bu nə deməkdir?",
        "options": [
          {
            "id": "a",
            "text": "Məlumat demək olar ki, bir müstəvi üzərindədir — 2D proyeksiya az informasiya itirir"
          },
          {
            "id": "b",
            "text": "Məlumat təsadüfidir"
          },
          {
            "id": "c",
            "text": "PCA uğursuz oldu"
          }
        ],
        "correctOptionId": "a",
        "explanation": "İtirilən dispersiya cəmi 0.19%-dir."
      }
    ]
  },
  {
    "id": "ch07.quiz.pca-practice",
    "title": "Bilik yoxlaması: PCA praktikada",
    "description": "Ölçü seçimi və sıxılma.",
    "chapterId": "ch07",
    "lessonId": "ch07.pca-practice",
    "questions": [
      {
        "id": "q1",
        "type": "single-choice",
        "prompt": "PCA(n_components=0.95) nə edir?",
        "options": [
          {
            "id": "a",
            "text": "Dispersiyanın 95%-ni saxlamaq üçün lazım olan minimal komponent sayını seçir"
          },
          {
            "id": "b",
            "text": "95 komponent saxlayır"
          },
          {
            "id": "c",
            "text": "Məlumatın 95%-ni atır"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Rəqəmlər üçün bu, 64-dən 29 komponent oldu."
      },
      {
        "id": "q2",
        "type": "single-choice",
        "prompt": "Məlumat yaddaşa sığmırsa, hansı PCA variantı uyğundur?",
        "options": [
          {
            "id": "a",
            "text": "IncrementalPCA (partial_fit ilə)"
          },
          {
            "id": "b",
            "text": "Adi PCA"
          },
          {
            "id": "c",
            "text": "PCA istifadə etmək olmaz"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Mini-paketlərlə emal edir və eyni nəticəyə çox yaxın gəlir."
      },
      {
        "id": "q3",
        "type": "true-false",
        "prompt": "inverse_transform() sıxılmış məlumatdan orijinalın dəqiq nüsxəsini bərpa edir.",
        "answer": false,
        "explanation": "Atılan komponentlərdəki informasiya itir. Bərpa təxminidir və bərpa xətası bunu ölçür."
      }
    ]
  },
  {
    "id": "ch07.quiz.random-projection",
    "title": "Bilik yoxlaması: təsadüfi proyeksiya",
    "description": "Conson–Lindenştraus.",
    "chapterId": "ch07",
    "lessonId": "ch07.random-projection",
    "questions": [
      {
        "id": "q1",
        "type": "single-choice",
        "prompt": "Conson–Lindenştraus həddi hansı kəmiyyətdən asılı DEYİL?",
        "options": [
          {
            "id": "a",
            "text": "Orijinal ölçü sayından (n)"
          },
          {
            "id": "b",
            "text": "Nümunə sayından (m)"
          },
          {
            "id": "c",
            "text": "İcazə verilən xətadan (ε)"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Lazım olan ölçü yalnız m və ε-dan asılıdır. Ona görə də çox yüksək ölçülü məlumatda xüsusilə faydalıdır."
      },
      {
        "id": "q2",
        "type": "true-false",
        "prompt": "Təsadüfi proyeksiya üçün məlumatdan heç nə öyrənmək lazım deyil — matris təsadüfi yaradılır.",
        "answer": true,
        "explanation": "Ona görə də PCA-dan xeyli sürətlidir."
      }
    ]
  },
  {
    "id": "ch07.quiz.manifold",
    "title": "Bilik yoxlaması: manifold öyrənmə",
    "description": "LLE, t-SNE və digərləri.",
    "chapterId": "ch07",
    "lessonId": "ch07.manifold",
    "questions": [
      {
        "id": "q1",
        "type": "single-choice",
        "prompt": "t-SNE əsasən nə üçün istifadə olunur?",
        "options": [
          {
            "id": "a",
            "text": "Yüksək ölçülü məlumatın 2D/3D vizuallaşdırılması üçün"
          },
          {
            "id": "b",
            "text": "Model təlimindən əvvəl ön emal üçün"
          },
          {
            "id": "c",
            "text": "Məlumatın sıxılması üçün"
          }
        ],
        "correctOptionId": "a",
        "explanation": "t-SNE klasterləri vizual olaraq yaxşı ayırır, lakin yeni nöqtələri çevirmək üçün transform() metodu yoxdur."
      },
      {
        "id": "q2",
        "type": "single-choice",
        "prompt": "LLE hansı əlaqələri aşağı ölçüdə qorumağa çalışır?",
        "options": [
          {
            "id": "a",
            "text": "Hər nöqtənin ən yaxın qonşularının xətti kombinasiyası kimi təsvirini"
          },
          {
            "id": "b",
            "text": "Bütün cüt məsafələri"
          },
          {
            "id": "c",
            "text": "Dispersiyanı"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Bu fəsildə LLE rulonu açdı: açılmış koordinat rulonun uzunluğu ilə 0.997 korrelyasiya göstərdi."
      }
    ]
  },
  {
    "id": "ch07.quiz.final",
    "title": "Fəsil 7 — yekun test",
    "description": "Ölçünün azaldılmasının bütün mövzuları. Keçid balı: 70%.",
    "chapterId": "ch07",
    "passingScore": 0.7,
    "questions": [
      {
        "id": "q1",
        "type": "multiple-choice",
        "prompt": "Ölçünü azaltmağın əsas səbəbləri hansılardır?",
        "options": [
          {
            "id": "a",
            "text": "Təlimi sürətləndirmək"
          },
          {
            "id": "b",
            "text": "Vizuallaşdırma"
          },
          {
            "id": "c",
            "text": "Yaddaşa qənaət (sıxılma)"
          },
          {
            "id": "d",
            "text": "Həmişə dəqiqliyi artırmaq"
          }
        ],
        "correctOptionIds": [
          "a",
          "b",
          "c"
        ],
        "explanation": "Ölçü azaltma informasiya itirir və adətən dəqiqliyi bir qədər azaldır, bəzən isə küyü süzərək artırır."
      },
      {
        "id": "q2",
        "type": "single-choice",
        "prompt": "Rəqəmlər üçün PCA (95%) ilə logistik reqressiyanın CV dəqiqliyi 0.912, bütün piksellərlə isə 0.920 oldu. Hansı nəticə doğrudur?",
        "options": [
          {
            "id": "a",
            "text": "PCA bir az informasiya itirdi, lakin əlamət sayını xeyli azaltdı"
          },
          {
            "id": "b",
            "text": "PCA həmişə dəqiqliyi artırır"
          },
          {
            "id": "c",
            "text": "PCA işləmir"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Sürət/yaddaş qazancı ilə kiçik dəqiqlik itkisi arasında kompromisdir."
      },
      {
        "id": "q3",
        "type": "single-choice",
        "prompt": "PCA-dan əvvəl əlamətləri adətən niyə standartlaşdırırlar?",
        "options": [
          {
            "id": "a",
            "text": "Əks halda böyük miqyaslı əlamətlər dispersiyada üstünlük təşkil edir"
          },
          {
            "id": "b",
            "text": "PCA mətn əlamətləri tələb edir"
          },
          {
            "id": "c",
            "text": "Ehtiyac yoxdur"
          }
        ],
        "correctOptionId": "a",
        "explanation": "PCA dispersiyaya əsaslanır, ona görə miqyasa həssasdır."
      },
      {
        "id": "q4",
        "type": "true-false",
        "prompt": "Əsas komponentlər bir-birinə ortoqonaldır (perpendikulyardır).",
        "answer": true,
        "explanation": "Hər yeni komponent əvvəlkilərə perpendikulyar olan istiqamətlər arasında maksimal dispersiyalı istiqamətdir."
      },
      {
        "id": "q5",
        "type": "single-choice",
        "prompt": "SVD-də X = UΣVᵀ. Əsas komponentlər haradadır?",
        "options": [
          {
            "id": "a",
            "text": "V-nin sütunlarında (Vᵀ-nin sətirlərində)"
          },
          {
            "id": "b",
            "text": "U-da"
          },
          {
            "id": "c",
            "text": "Σ-da"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Σ-dakı təklik qiymətlərinin kvadratı komponentlərin dispersiyası ilə mütənasibdir."
      },
      {
        "id": "q6",
        "type": "single-choice",
        "prompt": "Rulon şəklində əyilmiş məlumat üçün hansı üsul daha uyğundur?",
        "options": [
          {
            "id": "a",
            "text": "LLE və ya Isomap"
          },
          {
            "id": "b",
            "text": "PCA"
          },
          {
            "id": "c",
            "text": "Təsadüfi proyeksiya"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Xətti üsullar manifoldu aça bilmir."
      },
      {
        "id": "q7",
        "type": "single-choice",
        "prompt": "10 000 ölçülü 2 000 nümunəni ±20% dəqiqliklə saxlamaq üçün JL həddi təxminən neçə ölçüdür?",
        "options": [
          {
            "id": "a",
            "text": "≈ 1 750"
          },
          {
            "id": "b",
            "text": "≈ 10"
          },
          {
            "id": "c",
            "text": "≈ 9 000"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Bu fəsildə 1 754 alındı və həqiqi məsafə nisbətləri 0.95–1.06 arasında oldu."
      },
      {
        "id": "q8",
        "type": "true-false",
        "prompt": "t-SNE ilə alınmış 2D xəritədə klasterlər arasındakı məsafələr həmişə orijinal fəzadakı məsafələri dəqiq əks etdirir.",
        "answer": false,
        "explanation": "t-SNE lokal qonşuluqları qoruyur, qlobal məsafələr isə təhrif oluna bilər."
      },
      {
        "id": "q9",
        "type": "single-choice",
        "prompt": "Ölçü sayını seçməyin ən etibarlı yolu nədir, əgər PCA təsnifatdan əvvəl ön emal kimi istifadə olunursa?",
        "options": [
          {
            "id": "a",
            "text": "n_components-i pipeline-da hiperparametr kimi çarpaz validasiya ilə seçmək"
          },
          {
            "id": "b",
            "text": "Həmişə 2 seçmək"
          },
          {
            "id": "c",
            "text": "Ən böyük ölçünü saxlamaq"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Məqsəd son modelin performansıdır, dispersiya payı isə yalnız ipucudur."
      },
      {
        "id": "q10",
        "type": "single-choice",
        "prompt": "Incremental PCA nə vaxt üstündür?",
        "options": [
          {
            "id": "a",
            "text": "Məlumat yaddaşa sığmadıqda və ya onlayn gəldikdə"
          },
          {
            "id": "b",
            "text": "Məlumat çox kiçik olduqda"
          },
          {
            "id": "c",
            "text": "Heç vaxt"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Bu fəsildə 10 paketlə öyrədilmiş IncrementalPCA adi PCA ilə demək olar ki, eyni dispersiyanı saxladı (0.953 vs 0.955)."
      }
    ]
  }
];
