import type { z } from "zod";
import type { quizSchema } from "@/lib/schemas";

export const chapter06Quizzes: z.input<typeof quizSchema>[] = [
  {
    "id": "ch06.quiz.voting",
    "title": "Bilik yoxlaması: səsvermə",
    "description": "Kütlənin müdrikliyi və səsvermə növləri.",
    "chapterId": "ch06",
    "lessonId": "ch06.voting",
    "questions": [
      {
        "id": "q1",
        "type": "single-choice",
        "prompt": "Hər biri 51% dəqiqlikli 1 001 müstəqil təsnifatçının səs çoxluğu təxminən hansı dəqiqliyi verir?",
        "options": [
          {
            "id": "a",
            "text": "≈ 51%"
          },
          {
            "id": "b",
            "text": "≈ 74%"
          },
          {
            "id": "c",
            "text": "≈ 100%"
          }
        ],
        "correctOptionId": "b",
        "explanation": "Binomial paylanmaya görə səs çoxluğunun düzgün olma ehtimalı ≈ 73.7%-dir (10 001 təsnifatçı ilə ≈ 97.7%). Bu, yalnız təsnifatçılar müstəqil olduqda doğrudur."
      },
      {
        "id": "q2",
        "type": "single-choice",
        "prompt": "Yumşaq səsvermə nəyə əsaslanır?",
        "options": [
          {
            "id": "a",
            "text": "Təsnifatçıların sinif ehtimallarının ortasına"
          },
          {
            "id": "b",
            "text": "Ən dəqiq təsnifatçının cavabına"
          },
          {
            "id": "c",
            "text": "Təsadüfi seçimə"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Əmin proqnozlar daha çox çəki alır. Bütün modellərdə predict_proba() olmalıdır, məsələn SVC(probability=True)."
      },
      {
        "id": "q3",
        "type": "true-false",
        "prompt": "Eyni məlumatda öyrədilmiş oxşar modellərin ansamblı adətən çox böyük qazanc vermir, çünki onlar eyni nöqtələrdə səhv edirlər.",
        "answer": true,
        "explanation": "Ansamblın gücü müxtəliflikdən gəlir. Bu fəslin nümunəsində yumşaq səsvermə ən yaxşı tək modeldən cəmi 0.1 faiz bəndi yaxşı oldu."
      }
    ]
  },
  {
    "id": "ch06.quiz.bagging",
    "title": "Bilik yoxlaması: bagging",
    "description": "Bootstrap, pasting və OOB.",
    "chapterId": "ch06",
    "lessonId": "ch06.bagging",
    "questions": [
      {
        "id": "q1",
        "type": "single-choice",
        "prompt": "Bootstrap seçmədə m nümunədən m dəfə qaytarmaqla seçdikdə hər nümunənin heç seçilməmə ehtimalı təxminən nə qədərdir?",
        "options": [
          {
            "id": "a",
            "text": "≈ 37% (1/e)"
          },
          {
            "id": "b",
            "text": "≈ 50%"
          },
          {
            "id": "c",
            "text": "≈ 5%"
          }
        ],
        "correctOptionId": "a",
        "explanation": "(1 − 1/m)^m → e⁻¹ ≈ 0.368. Bu nümunələr həmin ağac üçün “çanta xaricindədir” (OOB)."
      },
      {
        "id": "q2",
        "type": "single-choice",
        "prompt": "OOB qiymətləndirmənin əsas üstünlüyü nədir?",
        "options": [
          {
            "id": "a",
            "text": "Ayrıca validasiya dəstinə ehtiyac olmadan ümumiləşdirmə xətasını təxmin edir"
          },
          {
            "id": "b",
            "text": "Təlimi sürətləndirir"
          },
          {
            "id": "c",
            "text": "Ağacları dərinləşdirir"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Hər nümunə onu görməyən ağaclarla qiymətləndirilir. Bu fəsildə OOB 0.903, test isə 0.915 oldu."
      },
      {
        "id": "q3",
        "type": "true-false",
        "prompt": "Bagging əsasən modelin dispersiyasını azaldır, sürüşməsini isə demək olar ki, dəyişmir.",
        "answer": true,
        "explanation": "Ortalama ayrı-ayrı ağacların təsadüfi dalğalanmalarını hamarlayır."
      }
    ]
  },
  {
    "id": "ch06.quiz.forest",
    "title": "Bilik yoxlaması: təsadüfi meşələr",
    "description": "Meşə, Extra-Trees və əlamət əhəmiyyəti.",
    "chapterId": "ch06",
    "lessonId": "ch06.random-forests",
    "questions": [
      {
        "id": "q1",
        "type": "single-choice",
        "prompt": "Təsadüfi meşə bagging-dən nə ilə fərqlənir?",
        "options": [
          {
            "id": "a",
            "text": "Hər düyündə bölgü yalnız təsadüfi seçilmiş əlamət alt-çoxluğu arasında axtarılır"
          },
          {
            "id": "b",
            "text": "Ağaclar ardıcıl öyrədilir"
          },
          {
            "id": "c",
            "text": "Bootstrap istifadə edilmir"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Bu, ağacları daha müxtəlif edir: dispersiya azalır, sürüşmə bir qədər artır."
      },
      {
        "id": "q2",
        "type": "single-choice",
        "prompt": "Rəqəm şəkillərində kənar sütunlardakı piksellərin ümumi əhəmiyyəti cəmi 0.007 çıxdı. Bunun səbəbi nədir?",
        "options": [
          {
            "id": "a",
            "text": "Bu piksellər demək olar ki, həmişə boşdur və siniflər haqqında informasiya daşımır"
          },
          {
            "id": "b",
            "text": "Təsadüfi meşədə səhv var"
          },
          {
            "id": "c",
            "text": "Kənar piksellər ən vacibdir"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Rəqəmlər şəklin mərkəzində yazılır. Mərkəzi 4×4 blok isə ümumi əhəmiyyətin 47%-ni toplayır."
      },
      {
        "id": "q3",
        "type": "true-false",
        "prompt": "Extra-Trees hər əlamət üçün ən yaxşı yox, təsadüfi hədd seçdiyi üçün adi təsadüfi meşədən daha sürətli öyrədilir.",
        "answer": true,
        "explanation": "Ən yaxşı həddi axtarmaq ağac təliminin ən bahalı hissəsidir. Hansının daha dəqiq olacağını isə yalnız çarpaz validasiya göstərir."
      }
    ]
  },
  {
    "id": "ch06.quiz.boosting",
    "title": "Bilik yoxlaması: bustinq",
    "description": "AdaBoost və qradiyent bustinqi.",
    "chapterId": "ch06",
    "lessonId": "ch06.boosting",
    "questions": [
      {
        "id": "q1",
        "type": "single-choice",
        "prompt": "Qradiyent bustinqində hər yeni ağac nəyi öyrənir (kvadrat itki üçün)?",
        "options": [
          {
            "id": "a",
            "text": "Əvvəlki ansamblın qalıqlarını (y − ŷ)"
          },
          {
            "id": "b",
            "text": "Orijinal hədəfi yenidən"
          },
          {
            "id": "c",
            "text": "Təsadüfi əlamətləri"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Hər ağac hələ izah edilməmiş hissəni modelləşdirir və proqnoza η qədər töhfə verir."
      },
      {
        "id": "q2",
        "type": "single-choice",
        "prompt": "Bustinq overfit edirsə, hansı addım kömək EDƏR?",
        "options": [
          {
            "id": "a",
            "text": "Öyrənmə sürətini azaltmaq və erkən dayandırma istifadə etmək"
          },
          {
            "id": "b",
            "text": "Ağac sayını sonsuz artırmaq"
          },
          {
            "id": "c",
            "text": "Ağacları məhdudiyyətsiz böyütmək"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Kiçik η (shrinkage) və erkən dayandırma bustinqin əsas requlyarlaşdırma alətləridir."
      },
      {
        "id": "q3",
        "type": "true-false",
        "prompt": "Bustinqi bagging kimi asanlıqla paralelləşdirmək olmur, çünki hər model əvvəlkinin nəticəsindən asılıdır.",
        "answer": true,
        "explanation": "Ardıcıl təbiət bustinqin əsas çatışmazlığıdır. Hər ağacın daxilindəki hesablamalar isə paralel aparıla bilər (məs. XGBoost, HistGB)."
      }
    ]
  },
  {
    "id": "ch06.quiz.stacking",
    "title": "Bilik yoxlaması: stacking",
    "description": "Blender və onun təlimi.",
    "chapterId": "ch06",
    "lessonId": "ch06.stacking",
    "questions": [
      {
        "id": "q1",
        "type": "single-choice",
        "prompt": "Stacking-də blender niyə əsas modellərin çarpaz validasiya proqnozları ilə öyrədilir?",
        "options": [
          {
            "id": "a",
            "text": "Təlim dəstindəki proqnozlar optimist olardı və blender overfit edən modellərə həddindən artıq güvənərdi"
          },
          {
            "id": "b",
            "text": "Daha sürətli olduğu üçün"
          },
          {
            "id": "c",
            "text": "Bu, məcburi deyil"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Blender əsas modellərin yeni məlumatda necə davrandığını görməlidir."
      },
      {
        "id": "q2",
        "type": "true-false",
        "prompt": "Bu fəsildə stacking (0.920) ən yaxşı tək modeldən (0.917) cəmi bir qədər yaxşı oldu.",
        "answer": true,
        "explanation": "Əsas modellər oxşar səhvlər edirdi. Qazanc müxtəliflik artdıqca böyüyür."
      }
    ]
  },
  {
    "id": "ch06.quiz.final",
    "title": "Fəsil 6 — yekun test",
    "description": "Ansambl öyrənmənin bütün üsulları. Keçid balı: 70%.",
    "chapterId": "ch06",
    "passingScore": 0.7,
    "questions": [
      {
        "id": "q1",
        "type": "single-choice",
        "prompt": "Ansamblın tək modeldən yaxşı olması üçün ən vacib şərt hansıdır?",
        "options": [
          {
            "id": "a",
            "text": "Modellərin səhvlərinin mümkün qədər müstəqil (müxtəlif) olması"
          },
          {
            "id": "b",
            "text": "Bütün modellərin eyni olması"
          },
          {
            "id": "c",
            "text": "Modellərin çox mürəkkəb olması"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Korrelyasiyalı səhvlər ortalama ilə yox olmur."
      },
      {
        "id": "q2",
        "type": "single-choice",
        "prompt": "Bagging ilə pasting arasındakı fərq nədir?",
        "options": [
          {
            "id": "a",
            "text": "Bagging qaytarmaqla, pasting qaytarmadan seçir"
          },
          {
            "id": "b",
            "text": "Pasting ardıcıl öyrədir"
          },
          {
            "id": "c",
            "text": "Fərq yoxdur"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Bootstrap (qaytarmaqla) daha çox müxtəliflik yaradır."
      },
      {
        "id": "q3",
        "type": "single-choice",
        "prompt": "Bu fəsildə tək qərar ağacı testdə 0.883, 300 ağaclı bagging isə hansı nəticəni verdi?",
        "options": [
          {
            "id": "a",
            "text": "0.915"
          },
          {
            "id": "b",
            "text": "0.883"
          },
          {
            "id": "c",
            "text": "0.700"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Ortalama ağacın dispersiyasını azaltdı."
      },
      {
        "id": "q4",
        "type": "multiple-choice",
        "prompt": "Hansılar bagging/meşə modelinin hiperparametrləridir?",
        "options": [
          {
            "id": "a",
            "text": "n_estimators"
          },
          {
            "id": "b",
            "text": "max_samples"
          },
          {
            "id": "c",
            "text": "max_features"
          },
          {
            "id": "d",
            "text": "learning_rate"
          }
        ],
        "correctOptionIds": [
          "a",
          "b",
          "c"
        ],
        "explanation": "learning_rate bustinqin hiperparametridir."
      },
      {
        "id": "q5",
        "type": "single-choice",
        "prompt": "AdaBoost əvvəlki təsnifatçının səhv etdiyi nümunələrlə nə edir?",
        "options": [
          {
            "id": "a",
            "text": "Onların çəkisini artırır"
          },
          {
            "id": "b",
            "text": "Onları silir"
          },
          {
            "id": "c",
            "text": "Heç nə"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Növbəti təsnifatçı çətin nümunələrə daha çox diqqət yetirir."
      },
      {
        "id": "q6",
        "type": "single-choice",
        "prompt": "Qradiyent bustinqində η = 0.1 və 3 ağac ilə test RMSE 4.70, 100 ağacla isə 1.43 oldu. Bu nəyi göstərir?",
        "options": [
          {
            "id": "a",
            "text": "Kiçik η ilə yaxşı nəticə üçün çox ağac lazımdır"
          },
          {
            "id": "b",
            "text": "Kiçik η həmişə pisdir"
          },
          {
            "id": "c",
            "text": "Ağac sayı vacib deyil"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Shrinkage hər ağacın töhfəsini azaldır, ona görə daha çox ağac tələb edir."
      },
      {
        "id": "q7",
        "type": "true-false",
        "prompt": "Təsadüfi meşənin feature_importances_ atributu əlamətlərin qeyri-müəyyənliyi orta hesabla nə qədər azaltdığına əsaslanır.",
        "answer": true,
        "explanation": "Hər düyündəki çəkili qeyri-müəyyənlik azalması bütün ağaclar üzrə toplanıb normallaşdırılır."
      },
      {
        "id": "q8",
        "type": "single-choice",
        "prompt": "Böyük məlumatda (yüz minlərlə nümunə) bustinq üçün hansı Scikit-Learn sinfi tövsiyə olunur?",
        "options": [
          {
            "id": "a",
            "text": "HistGradientBoostingClassifier/Regressor"
          },
          {
            "id": "b",
            "text": "AdaBoostClassifier"
          },
          {
            "id": "c",
            "text": "BaggingClassifier"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Əlamətləri histoqram qutularına bölür, çox sürətlidir və çatışmayan qiymətləri özü emal edir."
      },
      {
        "id": "q9",
        "type": "true-false",
        "prompt": "Erkən dayandırma ilə qradiyent bustinqi optimal ağac sayını validasiya xətasına görə avtomatik tapa bilər.",
        "answer": true,
        "explanation": "Scikit-Learn-də n_iter_no_change və validation_fraction parametrləri bunu edir."
      },
      {
        "id": "q10",
        "type": "single-choice",
        "prompt": "Stacking-də blender kimi adətən hansı model seçilir?",
        "options": [
          {
            "id": "a",
            "text": "Sadə model, məsələn logistik reqressiya"
          },
          {
            "id": "b",
            "text": "Ən mürəkkəb neyron şəbəkə"
          },
          {
            "id": "c",
            "text": "Heç bir model, sadəcə orta"
          }
        ],
        "correctOptionId": "a",
        "explanation": "Blenderin girişləri az və informativdir. Sadə model overfitting riskini azaldır."
      }
    ]
  }
];
