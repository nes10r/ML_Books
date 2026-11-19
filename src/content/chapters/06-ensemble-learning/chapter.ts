import type { ChapterInput } from "@/lib/schemas";

export const chapter06: ChapterInput = {
  "id": "ch06",
  "slug": "ensemble-learning",
  "number": 6,
  "partId": "part-1",
  "title": "Ansambl öyrənmə və təsadüfi meşələr",
  "description": "Bir modeldən çox, modellər “komandası”: səsvermə, bagging və OOB qiymətləndirmə, təsadüfi meşələr və Extra-Trees, AdaBoost və qradiyent bustinqi, stacking.",
  "estimatedDuration": 140,
  "difficulty": "intermediate",
  "status": "published",
  "bookReference": {
    "chapter": 6,
    "originalTitle": "Ensemble Learning and Random Forests"
  },
  "tags": [
    "voting",
    "bagging",
    "random forest",
    "boosting",
    "stacking"
  ],
  "prerequisites": [
    {
      "kind": "chapter",
      "chapterId": "ch05"
    }
  ],
  "learningObjectives": [
    {
      "id": "ch06.obj.why",
      "text": "Ansamblın niyə tək modeldən yaxşı ola biləcəyini müstəqillik və müxtəliflik baxımından izah etmək",
      "level": "understand"
    },
    {
      "id": "ch06.obj.bagging",
      "text": "Bagging, təsadüfi meşə və Extra-Trees-i tətbiq etmək, OOB ilə qiymətləndirmək",
      "level": "apply"
    },
    {
      "id": "ch06.obj.boosting",
      "text": "AdaBoost və qradiyent bustinqinin ardıcıl öyrənmə məntiqini izah etmək və tənzimləmək",
      "level": "analyze"
    },
    {
      "id": "ch06.obj.stacking",
      "text": "Stacking ansamblı qurmaq və onu sadə səsvermə ilə müqayisə etmək",
      "level": "apply"
    }
  ],
  "mediaReferences": [
    "ch06.media.ensemble-types"
  ],
  "interactiveDemoReferences": [
    "voting-wisdom",
    "bagging-forest",
    "gradient-boosting"
  ],
  "githubReferences": [],
  "quizIds": [
    "ch06.quiz.final"
  ],
  "lessons": [
    {
      "id": "ch06.voting",
      "slug": "voting-classifiers",
      "title": "Səsvermə təsnifatçıları",
      "description": "Kütlənin müdrikliyi: sərt və yumşaq səsvermə, müstəqillik və müxtəlifliyin rolu.",
      "type": "visual-simulation",
      "estimatedDuration": 25,
      "difficulty": "intermediate",
      "status": "published",
      "tags": [
        "VotingClassifier",
        "hard voting",
        "soft voting"
      ],
      "prerequisites": [
        {
          "kind": "chapter",
          "chapterId": "ch05"
        }
      ],
      "learningObjectives": [
        {
          "id": "ch06.voting.obj1",
          "text": "Çoxlu zəif təsnifatçının səs çoxluğunun niyə güclü ola biləcəyini izah etmək",
          "level": "understand"
        },
        {
          "id": "ch06.voting.obj2",
          "text": "Sərt və yumşaq səsverməni tətbiq etmək və müqayisə etmək",
          "level": "apply"
        }
      ],
      "sections": [
        {
          "id": "wisdom",
          "title": "Kütlənin müdrikliyi",
          "kind": "concept"
        },
        {
          "id": "law-of-large-numbers",
          "title": "Böyük ədədlər qanunu",
          "kind": "math"
        },
        {
          "id": "simulation",
          "title": "Simulyasiya: səs çoxluğunun gücü",
          "kind": "visualization"
        },
        {
          "id": "hard-soft",
          "title": "Sərt və yumşaq səsvermə",
          "kind": "concept"
        },
        {
          "id": "python",
          "title": "Python: VotingClassifier",
          "kind": "python"
        },
        {
          "id": "summary",
          "title": "Xülasə",
          "kind": "summary"
        }
      ],
      "keyConcepts": [
        "ensemble-learning",
        "hard-voting",
        "soft-voting",
        "weak-learner"
      ],
      "mediaReferences": [
        "ch06.media.ensemble-types"
      ],
      "interactiveDemoReferences": [
        "voting-wisdom"
      ],
      "codeExampleIds": [
        "ch06.code.voting"
      ],
      "quizId": "ch06.quiz.voting",
      "exerciseIds": [
        "ch06.ex.voting"
      ],
      "resourceIds": [
        "res.sklearn-ensemble"
      ]
    },
    {
      "id": "ch06.bagging",
      "slug": "bagging-and-pasting",
      "title": "Bagging, pasting və OOB qiymətləndirmə",
      "description": "Eyni alqoritmi məlumatın fərqli təsadüfi nüsxələrində öyrətmək və test dəstinə toxunmadan qiymətləndirmək.",
      "type": "visual-simulation",
      "estimatedDuration": 30,
      "difficulty": "intermediate",
      "status": "published",
      "tags": [
        "BaggingClassifier",
        "bootstrap",
        "oob_score"
      ],
      "prerequisites": [
        {
          "kind": "lesson",
          "lessonId": "ch06.voting"
        }
      ],
      "learningObjectives": [
        {
          "id": "ch06.bagging.obj1",
          "text": "Bagging və pasting-in fərqini və dispersiyaya təsirini izah etmək",
          "level": "understand"
        },
        {
          "id": "ch06.bagging.obj2",
          "text": "OOB qiymətləndirməni tətbiq etmək",
          "level": "apply"
        }
      ],
      "sections": [
        {
          "id": "bagging",
          "title": "Bagging və pasting",
          "kind": "concept"
        },
        {
          "id": "oob",
          "title": "Çanta xaricində (OOB) qiymətləndirmə",
          "kind": "math"
        },
        {
          "id": "simulation",
          "title": "Simulyasiya: ağaclardan meşəyə",
          "kind": "visualization"
        },
        {
          "id": "patches",
          "title": "Təsadüfi alt fəzalar və “yamaqlar”",
          "kind": "concept"
        },
        {
          "id": "python",
          "title": "Python: bagging və OOB",
          "kind": "python"
        },
        {
          "id": "summary",
          "title": "Xülasə",
          "kind": "summary"
        }
      ],
      "keyConcepts": [
        "bagging",
        "pasting",
        "bootstrap",
        "out-of-bag-evaluation",
        "random-subspaces"
      ],
      "interactiveDemoReferences": [
        "bagging-forest"
      ],
      "codeExampleIds": [
        "ch06.code.bagging"
      ],
      "quizId": "ch06.quiz.bagging",
      "exerciseIds": [
        "ch06.ex.oob"
      ]
    },
    {
      "id": "ch06.random-forests",
      "slug": "random-forests",
      "title": "Təsadüfi meşələr, Extra-Trees və əlamət əhəmiyyəti",
      "description": "Bagging + təsadüfi əlamətlər: güclü “hazır” model və onun hansı əlamətlərə güvəndiyini ölçmək.",
      "type": "code-lab",
      "estimatedDuration": 25,
      "difficulty": "intermediate",
      "status": "published",
      "tags": [
        "RandomForestClassifier",
        "ExtraTreesClassifier",
        "feature_importances_"
      ],
      "prerequisites": [
        {
          "kind": "lesson",
          "lessonId": "ch06.bagging"
        }
      ],
      "learningObjectives": [
        {
          "id": "ch06.random-forests.obj1",
          "text": "Təsadüfi meşə və Extra-Trees-in bagging-dən fərqini izah etmək",
          "level": "understand"
        },
        {
          "id": "ch06.random-forests.obj2",
          "text": "Əlamət əhəmiyyətini hesablamaq və şərh etmək",
          "level": "analyze"
        }
      ],
      "sections": [
        {
          "id": "forest",
          "title": "Təsadüfi meşə",
          "kind": "concept"
        },
        {
          "id": "extra-trees",
          "title": "Extra-Trees",
          "kind": "concept"
        },
        {
          "id": "importance",
          "title": "Əlamət əhəmiyyəti",
          "kind": "worked-example"
        },
        {
          "id": "python",
          "title": "Python: meşə və piksellərin əhəmiyyəti",
          "kind": "python"
        },
        {
          "id": "summary",
          "title": "Xülasə",
          "kind": "summary"
        }
      ],
      "keyConcepts": [
        "random-forest",
        "extra-trees",
        "feature-importance"
      ],
      "interactiveDemoReferences": [
        "bagging-forest"
      ],
      "codeExampleIds": [
        "ch06.code.forest"
      ],
      "quizId": "ch06.quiz.forest",
      "exerciseIds": [
        "ch06.ex.importance"
      ]
    },
    {
      "id": "ch06.boosting",
      "slug": "boosting",
      "title": "Bustinq: AdaBoost və qradiyent bustinqi",
      "description": "Modelləri ardıcıl öyrətmək: hər yeni model əvvəlkilərin səhvlərini düzəldir.",
      "type": "visual-simulation",
      "estimatedDuration": 40,
      "difficulty": "intermediate",
      "status": "published",
      "tags": [
        "AdaBoost",
        "GradientBoosting",
        "HistGradientBoosting",
        "early stopping"
      ],
      "prerequisites": [
        {
          "kind": "lesson",
          "lessonId": "ch06.random-forests"
        }
      ],
      "learningObjectives": [
        {
          "id": "ch06.boosting.obj1",
          "text": "AdaBoost-un nümunə çəkilərini necə yenilədiyini izah etmək",
          "level": "understand"
        },
        {
          "id": "ch06.boosting.obj2",
          "text": "Qradiyent bustinqində qalıqlara uyğunlaşmanı və shrinkage-i izah etmək",
          "level": "understand"
        },
        {
          "id": "ch06.boosting.obj3",
          "text": "Bustinq modelini erkən dayandırma ilə tənzimləmək",
          "level": "apply"
        }
      ],
      "sections": [
        {
          "id": "idea",
          "title": "Ardıcıl öyrənmə ideyası",
          "kind": "concept"
        },
        {
          "id": "adaboost",
          "title": "AdaBoost",
          "kind": "math"
        },
        {
          "id": "gradient-boosting",
          "title": "Qradiyent bustinqi",
          "kind": "math"
        },
        {
          "id": "simulation",
          "title": "Simulyasiya: qalıqların öyrənilməsi",
          "kind": "visualization"
        },
        {
          "id": "hist",
          "title": "Histoqram əsaslı bustinq",
          "kind": "concept"
        },
        {
          "id": "python",
          "title": "Python: üç bustinq üsulu",
          "kind": "python"
        },
        {
          "id": "mistakes",
          "title": "Tipik səhvlər",
          "kind": "common-mistakes"
        },
        {
          "id": "summary",
          "title": "Xülasə",
          "kind": "summary"
        }
      ],
      "keyConcepts": [
        "boosting",
        "adaboost",
        "gradient-boosting",
        "shrinkage",
        "weak-learner"
      ],
      "interactiveDemoReferences": [
        "gradient-boosting"
      ],
      "codeExampleIds": [
        "ch06.code.boosting"
      ],
      "quizId": "ch06.quiz.boosting",
      "exerciseIds": [
        "ch06.ex.gbrt"
      ]
    },
    {
      "id": "ch06.stacking",
      "slug": "stacking",
      "title": "Stacking",
      "description": "Proqnozları sadə səsvermə ilə yox, öyrədilmiş “blender” modeli ilə birləşdirmək.",
      "type": "code-lab",
      "estimatedDuration": 20,
      "difficulty": "intermediate",
      "status": "published",
      "tags": [
        "StackingClassifier",
        "blender"
      ],
      "prerequisites": [
        {
          "kind": "lesson",
          "lessonId": "ch06.boosting"
        }
      ],
      "learningObjectives": [
        {
          "id": "ch06.stacking.obj1",
          "text": "Stacking-in quruluşunu və çarpaz validasiyanın rolunu izah etmək",
          "level": "understand"
        },
        {
          "id": "ch06.stacking.obj2",
          "text": "StackingClassifier qurmaq və nəticəni şərh etmək",
          "level": "apply"
        }
      ],
      "sections": [
        {
          "id": "idea",
          "title": "Blender ideyası",
          "kind": "concept"
        },
        {
          "id": "training",
          "title": "Blender necə öyrədilir?",
          "kind": "step-by-step"
        },
        {
          "id": "python",
          "title": "Python: StackingClassifier",
          "kind": "python"
        },
        {
          "id": "choosing",
          "title": "Hansı ansambl nə vaxt?",
          "kind": "case-study"
        },
        {
          "id": "summary",
          "title": "Xülasə",
          "kind": "summary"
        }
      ],
      "keyConcepts": [
        "stacking",
        "blender",
        "ensemble-learning"
      ],
      "codeExampleIds": [
        "ch06.code.stacking"
      ],
      "quizId": "ch06.quiz.stacking",
      "exerciseIds": [
        "ch06.ex.stacking"
      ]
    }
  ]
};
