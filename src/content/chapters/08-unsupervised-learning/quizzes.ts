import type { z } from "zod";
import type { quizSchema } from "@/lib/schemas";

export const chapter08Quizzes: z.input<typeof quizSchema>[] = [
  {
    "id": "ch08.quiz.kmeans",
    "title": "Bilik yoxlaması: k-means",
    "description": "Alqoritm və inisializasiya.",
    "chapterId": "ch08",
    "lessonId": "ch08.kmeans",
    "questions": [
      {
        "id": "q1",
        "type": "single-choice",
        "prompt": "k-means hansı kəmiyyəti minimallaşdırır?",
        "options": [
          {
            "id": "a",
            "text": "Inertia: nöqtələrlə ən yaxın mərkəzləri arasındakı kvadrat məsafələrin cəmi"
          },
          {
            "id": "b",
            "text": "Klaster sayını"
          },
          {
            "id": "c",
            "text": "Silhouette balını"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Hər iki addım (təyinat və yeniləmə) inertia-nı azaldır və ya dəyişməz saxlayır, ona görə alqoritm yığılır."
      },
      {
        "id": "q2",
        "type": "single-choice",
        "prompt": "20 tək təsadüfi başlanğıcdan 8-i pis yerli minimuma düşdü, k-means++ isə heç vaxt. k-means++ nə edir?",
        "options": [
          {
            "id": "a",
            "text": "İlk mərkəzləri bir-birindən uzaq seçir"
          },
          {
            "id": "b",
            "text": "Daha çox iterasiya edir"
          },
          {
            "id": "c",
            "text": "k-nı avtomatik seçir"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Yeni mərkəz mövcud mərkəzlərə məsafənin kvadratı ilə mütənasib ehtimalla seçilir."
      },
      {
        "id": "q3",
        "type": "true-false",
        "prompt": "k-means həmişə qlobal minimumu tapır.",
        "answer": false,
        "explanation": "Yalnız yerli minimuma yığılması zəmanətlidir. Ona görə də bir neçə başlanğıcla (n_init) işlədilir və ən kiçik inertia seçilir."
      }
    ]
  },
  {
    "id": "ch08.quiz.choosing-k",
    "title": "Bilik yoxlaması: k-nın seçimi",
    "description": "Dirsək və silhouette.",
    "chapterId": "ch08",
    "lessonId": "ch08.choosing-k",
    "questions": [
      {
        "id": "q1",
        "type": "single-choice",
        "prompt": "k-nı ən kiçik inertia-ya görə seçmək niyə səhvdir?",
        "options": [
          {
            "id": "a",
            "text": "Inertia k artdıqca həmişə azalır; k = m olduqda sıfır olur"
          },
          {
            "id": "b",
            "text": "Inertia hesablanmır"
          },
          {
            "id": "c",
            "text": "Səhv deyil"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Dirsək üsulu və ya silhouette balı lazımdır."
      },
      {
        "id": "q2",
        "type": "single-choice",
        "prompt": "Silhouette balı +1-ə yaxındırsa, nə deməkdir?",
        "options": [
          {
            "id": "a",
            "text": "Nöqtə öz klasterinin içində, digər klasterlərdən uzaqdadır"
          },
          {
            "id": "b",
            "text": "Nöqtə iki klasterin sərhədindədir"
          },
          {
            "id": "c",
            "text": "Nöqtə səhv klasterə düşüb"
          }
        ],
        "correctOptionId": "a",
        "explanation": "0-a yaxın qiymət sərhəd, mənfi qiymət isə yəqin ki, səhv təyinat deməkdir."
      },
      {
        "id": "q3",
        "type": "true-false",
        "prompt": "Bu fəsildə silhouette balı həqiqi qrup sayını (k = 5) düzgün göstərdi.",
        "answer": true,
        "explanation": "k = 5 üçün bal 0.711, ən yaxın rəqib k = 6 üçün isə 0.641 idi."
      }
    ]
  },
  {
    "id": "ch08.quiz.applications",
    "title": "Bilik yoxlaması: tətbiqlər",
    "description": "Seqmentasiya və yarı-nəzarətli öyrənmə.",
    "chapterId": "ch08",
    "lessonId": "ch08.kmeans-applications",
    "questions": [
      {
        "id": "q1",
        "type": "single-choice",
        "prompt": "50 təsadüfi etiketli şəkil 0.861, 50 “nümayəndə” şəkil isə 0.922 dəqiqlik verdi. Nümayəndələr necə seçildi?",
        "options": [
          {
            "id": "a",
            "text": "k-means-in hər klasterinin mərkəzinə ən yaxın şəkli"
          },
          {
            "id": "b",
            "text": "Ən parlaq şəkillər"
          },
          {
            "id": "c",
            "text": "Təsadüfi"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Hər klasterdən bir tipik nümunə məlumatın müxtəlifliyini daha yaxşı əhatə edir."
      },
      {
        "id": "q2",
        "type": "multiple-choice",
        "prompt": "k-means hansı hallarda pis işləyir?",
        "options": [
          {
            "id": "a",
            "text": "Klasterlər uzunsov və ya qeyri-qabarıq formadadır"
          },
          {
            "id": "b",
            "text": "Klasterlərin ölçüsü və sıxlığı çox fərqlidir"
          },
          {
            "id": "c",
            "text": "Əlamətlər miqyaslanmayıb"
          },
          {
            "id": "d",
            "text": "Klasterlər dəyirmi və bərabər ölçülüdür"
          }
        ],
        "correctOptionIds": [
          "a",
          "b",
          "c"
        ],
        "explanation": "Sonuncu hal k-means üçün idealdır."
      }
    ]
  },
  {
    "id": "ch08.quiz.dbscan",
    "title": "Bilik yoxlaması: DBSCAN",
    "description": "Sıxlığa əsaslanan klasterləşdirmə.",
    "chapterId": "ch08",
    "lessonId": "ch08.dbscan",
    "questions": [
      {
        "id": "q1",
        "type": "single-choice",
        "prompt": "DBSCAN-da “əsas nöqtə” nədir?",
        "options": [
          {
            "id": "a",
            "text": "ε radiuslu qonşuluğunda ən azı min_samples nöqtə (özü daxil) olan nöqtə"
          },
          {
            "id": "b",
            "text": "Klasterin mərkəzi"
          },
          {
            "id": "c",
            "text": "Ən uzaq nöqtə"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Əsas nöqtələr və onların qonşuları klasterləri təşkil edir."
      },
      {
        "id": "q2",
        "type": "single-choice",
        "prompt": "“Aylar” məlumatında DBSCAN (ε = 0.2) ARI = 1.000, k-means isə 0.239 verdi. Səbəb nədir?",
        "options": [
          {
            "id": "a",
            "text": "DBSCAN istənilən formalı sıx bölgələri tapır, k-means isə dəyirmi qruplar fərz edir"
          },
          {
            "id": "b",
            "text": "k-means-də səhv var"
          },
          {
            "id": "c",
            "text": "DBSCAN etiketləri görür"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Hər alqoritmin klaster haqqında öz fərziyyəsi var."
      },
      {
        "id": "q3",
        "type": "true-false",
        "prompt": "Scikit-Learn-in DBSCAN sinfinin yeni nöqtələr üçün predict() metodu yoxdur.",
        "answer": true,
        "explanation": "Bunun üçün əsas nöqtələr üzərində ayrıca təsnifatçı (məs. KNN) öyrədilir."
      }
    ]
  },
  {
    "id": "ch08.quiz.gmm",
    "title": "Bilik yoxlaması: Qauss qarışıqları",
    "description": "EM, BIC və anomaliyalar.",
    "chapterId": "ch08",
    "lessonId": "ch08.gmm",
    "questions": [
      {
        "id": "q1",
        "type": "single-choice",
        "prompt": "EM alqoritminin E-addımında nə hesablanır?",
        "options": [
          {
            "id": "a",
            "text": "Hər nöqtənin hər komponentə aid olma ehtimalı (məsuliyyətlər)"
          },
          {
            "id": "b",
            "text": "Yeni klaster sayı"
          },
          {
            "id": "c",
            "text": "Anomaliyalar"
          }
        ],
        "correctOptionId": "a",
        "explanation": "M-addımı bu ehtimallarla çəkiləri, ortaları və kovariasiyaları yeniləyir."
      },
      {
        "id": "q2",
        "type": "single-choice",
        "prompt": "Komponent sayı 1–6 üçün BIC 7999.7, 6957.9, 5869.5, 5910.9, 5945.6, 5982.2 oldu. Hansı seçilməlidir?",
        "options": [
          {
            "id": "a",
            "text": "3 (ən kiçik BIC)"
          },
          {
            "id": "b",
            "text": "6"
          },
          {
            "id": "c",
            "text": "1"
          }
        ],
        "correctOptionId": "a",
        "explanation": "BIC uyğunluğu parametr sayına görə cəzalandırır. Həqiqi komponent sayı da 3 idi."
      },
      {
        "id": "q3",
        "type": "true-false",
        "prompt": "Bayes GMM-də artıq komponentlərin çəkisi avtomatik sıfıra yaxınlaşır.",
        "answer": true,
        "explanation": "8 komponentlə başlanmış Bayes GMM 5 komponentin çəkisini 0-a endirdi."
      }
    ]
  },
  {
    "id": "ch08.quiz.final",
    "title": "Fəsil 8 — yekun test",
    "description": "Nəzarətsiz öyrənmənin bütün mövzuları. Keçid balı: 70%.",
    "chapterId": "ch08",
    "passingScore": 0.7,
    "questions": [
      {
        "id": "q1",
        "type": "single-choice",
        "prompt": "Klasterləşdirmə ilə təsnifatın əsas fərqi nədir?",
        "options": [
          {
            "id": "a",
            "text": "Klasterləşdirmədə etiket yoxdur — qruplar məlumatdan kəşf edilir"
          },
          {
            "id": "b",
            "text": "Təsnifat etiketsiz işləyir"
          },
          {
            "id": "c",
            "text": "Fərq yoxdur"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Təsnifat nəzarətli, klasterləşdirmə nəzarətsiz öyrənmədir."
      },
      {
        "id": "q2",
        "type": "single-choice",
        "prompt": "k-means-dən əvvəl əlamətləri niyə miqyaslamaq lazımdır?",
        "options": [
          {
            "id": "a",
            "text": "k-means Evklid məsafəsinə əsaslanır; böyük miqyaslı əlamət üstünlük təşkil edər"
          },
          {
            "id": "b",
            "text": "k-means mətn tələb edir"
          },
          {
            "id": "c",
            "text": "Lazım deyil"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Klasterlər qeyri-dəyirmi olsa belə, miqyaslama adətən kömək edir."
      },
      {
        "id": "q3",
        "type": "single-choice",
        "prompt": "MiniBatchKMeans nə vaxt üstündür?",
        "options": [
          {
            "id": "a",
            "text": "Məlumat çox böyük olduqda və ya yaddaşa sığmadıqda"
          },
          {
            "id": "b",
            "text": "Kiçik məlumatda dəqiqlik vacib olduqda"
          },
          {
            "id": "c",
            "text": "Heç vaxt"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Bir qədər yüksək inertia (549.0 vs 547.2) müqabilində xeyli sürətlidir."
      },
      {
        "id": "q4",
        "type": "true-false",
        "prompt": "Rəng seqmentasiyasında k-means hər pikselin rəngini onun klaster mərkəzinin rəngi ilə əvəz edir.",
        "answer": true,
        "explanation": "k rəngli palitra alınır. Bu fəsildə 4 rəng günəşi artıq ayrı seqment kimi saxladı."
      },
      {
        "id": "q5",
        "type": "single-choice",
        "prompt": "Etiketlərin klaster boyu yayılması (label propagation) zamanı hansı risk var?",
        "options": [
          {
            "id": "a",
            "text": "Klaster sərhədinə yaxın nöqtələr səhv etiket ala bilər"
          },
          {
            "id": "b",
            "text": "Etiketlər itir"
          },
          {
            "id": "c",
            "text": "Risk yoxdur"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Bu fəsildə yayılmış etiketlərin 95.5%-i düzgün idi."
      },
      {
        "id": "q6",
        "type": "single-choice",
        "prompt": "DBSCAN-da ε çox kiçik seçilsə nə olur?",
        "options": [
          {
            "id": "a",
            "text": "Çoxlu kiçik klaster və küy nöqtəsi yaranır"
          },
          {
            "id": "b",
            "text": "Hər şey bir klasterə düşür"
          },
          {
            "id": "c",
            "text": "Heç nə dəyişmir"
          }
        ],
        "correctOptionId": "a",
        "explanation": "ε = 0.05 ilə 15 klaster və 124 küy nöqtəsi alındı."
      },
      {
        "id": "q7",
        "type": "multiple-choice",
        "prompt": "Hansı alqoritmlər anomaliya aşkarlanması üçün istifadə oluna bilər?",
        "options": [
          {
            "id": "a",
            "text": "GaussianMixture (sıxlıq həddi)"
          },
          {
            "id": "b",
            "text": "IsolationForest"
          },
          {
            "id": "c",
            "text": "DBSCAN (küy nöqtələri)"
          },
          {
            "id": "d",
            "text": "LinearRegression"
          }
        ],
        "correctOptionIds": [
          "a",
          "b",
          "c"
        ],
        "explanation": "Hər biri “normal” məlumatın fərqli modelinə əsaslanır."
      },
      {
        "id": "q8",
        "type": "single-choice",
        "prompt": "Anomaliya aşkarlanması ilə yenilik aşkarlanmasının fərqi nədir?",
        "options": [
          {
            "id": "a",
            "text": "Yenilik aşkarlanmasında model təmiz (anomaliyasız) məlumatda öyrədilir"
          },
          {
            "id": "b",
            "text": "Fərq yoxdur"
          },
          {
            "id": "c",
            "text": "Yenilik aşkarlanması etiket tələb edir"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Anomaliya aşkarlanmasında təlim məlumatının özündə də anomaliyalar ola bilər."
      },
      {
        "id": "q9",
        "type": "true-false",
        "prompt": "GMM-də covariance_type=\"spherical\" seçmək modeli k-means-ə daha çox bənzədir.",
        "answer": true,
        "explanation": "Bütün klasterlər dəyirmi fərz olunur. \"full\" isə istənilən ellips formasını öyrənir."
      },
      {
        "id": "q10",
        "type": "single-choice",
        "prompt": "Silhouette balı ilə BIC arasında əsas fərq nədir?",
        "options": [
          {
            "id": "a",
            "text": "Silhouette məsafələrə əsaslanır (istənilən klasterləşdirmə üçün), BIC isə ehtimal modelinin uyğunluğuna (GMM üçün)"
          },
          {
            "id": "b",
            "text": "Eyni şeydir"
          },
          {
            "id": "c",
            "text": "BIC yalnız k-means üçündür"
          }
        ],
        "correctOptionId": "a",
        "explanation": "GMM üçün BIC/AIC daha təbii seçimdir."
      }
    ]
  }
];
