import type { ChapterInput } from "@/lib/schemas";

export const chapter08: ChapterInput = {
  "id": "ch08",
  "slug": "unsupervised-learning",
  "number": 8,
  "partId": "part-1",
  "title": "Nəzarətsiz öyrənmə üsulları",
  "description": "Etiketsiz məlumatdan dəyər çıxarmaq: k-means və onun tətbiqləri (seqmentasiya, yarı-nəzarətli öyrənmə), k-nın seçimi, DBSCAN, Qauss qarışıq modelləri və anomaliyaların aşkarlanması.",
  "estimatedDuration": 150,
  "difficulty": "intermediate",
  "status": "published",
  "bookReference": {
    "chapter": 8,
    "originalTitle": "Unsupervised Learning Techniques"
  },
  "tags": [
    "k-means",
    "DBSCAN",
    "GMM",
    "anomaly detection"
  ],
  "prerequisites": [
    {
      "kind": "chapter",
      "chapterId": "ch07"
    }
  ],
  "learningObjectives": [
    {
      "id": "ch08.obj.kmeans",
      "text": "k-means-i tətbiq etmək, inisializasiya və k seçimini əsaslandırmaq",
      "level": "apply"
    },
    {
      "id": "ch08.obj.uses",
      "text": "Klasterləşdirməni seqmentasiya və yarı-nəzarətli öyrənmə üçün istifadə etmək",
      "level": "apply"
    },
    {
      "id": "ch08.obj.density",
      "text": "k-means, DBSCAN və GMM arasında məlumatın formasına görə seçim etmək",
      "level": "evaluate"
    },
    {
      "id": "ch08.obj.anomaly",
      "text": "Sıxlıq modeli ilə anomaliyaları aşkar etmək",
      "level": "apply"
    }
  ],
  "mediaReferences": [
    "ch08.media.clustering-shapes"
  ],
  "interactiveDemoReferences": [
    "kmeans-steps",
    "kmeans-elbow",
    "dbscan",
    "gmm-anomaly"
  ],
  "githubReferences": [],
  "quizIds": [
    "ch08.quiz.final"
  ],
  "lessons": [
    {
      "id": "ch08.kmeans",
      "slug": "k-means",
      "title": "k-means klasterləşdirmə",
      "description": "Mərkəzlərə əsaslanan ən populyar klasterləşdirmə alqoritmi: addımlar, inertia, k-means++ və mini-paket variantı.",
      "type": "visual-simulation",
      "estimatedDuration": 35,
      "difficulty": "intermediate",
      "status": "published",
      "tags": [
        "KMeans",
        "inertia",
        "k-means++"
      ],
      "prerequisites": [
        {
          "kind": "chapter",
          "chapterId": "ch07"
        }
      ],
      "learningObjectives": [
        {
          "id": "ch08.kmeans.obj1",
          "text": "k-means-in iki addımını və yığılmasını izah etmək",
          "level": "understand"
        },
        {
          "id": "ch08.kmeans.obj2",
          "text": "İnisializasiyanın nəticəyə təsirini göstərmək",
          "level": "analyze"
        }
      ],
      "sections": [
        {
          "id": "clustering",
          "title": "Klasterləşdirmə nədir?",
          "kind": "concept"
        },
        {
          "id": "algorithm",
          "title": "k-means alqoritmi",
          "kind": "math"
        },
        {
          "id": "simulation",
          "title": "Simulyasiya: k-means addım-addım",
          "kind": "visualization"
        },
        {
          "id": "init",
          "title": "Mərkəzlərin inisializasiyası",
          "kind": "concept"
        },
        {
          "id": "python",
          "title": "Python: KMeans",
          "kind": "python"
        },
        {
          "id": "summary",
          "title": "Xülasə",
          "kind": "summary"
        }
      ],
      "keyConcepts": [
        "k-means",
        "centroid",
        "inertia",
        "k-means-plus-plus",
        "mini-batch-k-means"
      ],
      "mediaReferences": [
        "ch08.media.clustering-shapes"
      ],
      "interactiveDemoReferences": [
        "kmeans-steps"
      ],
      "codeExampleIds": [
        "ch08.code.kmeans"
      ],
      "quizId": "ch08.quiz.kmeans",
      "exerciseIds": [
        "ch08.ex.kmeans-init"
      ],
      "resourceIds": [
        "res.sklearn-clustering"
      ]
    },
    {
      "id": "ch08.choosing-k",
      "slug": "choosing-k",
      "title": "Klaster sayının seçimi",
      "description": "Dirsək üsulu və silhouette balı: k-nı ağılla seçmək.",
      "type": "visual-simulation",
      "estimatedDuration": 20,
      "difficulty": "intermediate",
      "status": "published",
      "tags": [
        "elbow",
        "silhouette_score"
      ],
      "prerequisites": [
        {
          "kind": "lesson",
          "lessonId": "ch08.kmeans"
        }
      ],
      "learningObjectives": [
        {
          "id": "ch08.choosing-k.obj1",
          "text": "Inertia-nın niyə k seçimi üçün təkbaşına yaramadığını izah etmək",
          "level": "understand"
        },
        {
          "id": "ch08.choosing-k.obj2",
          "text": "Silhouette balını hesablamaq və şərh etmək",
          "level": "apply"
        }
      ],
      "sections": [
        {
          "id": "elbow",
          "title": "Dirsək üsulu",
          "kind": "concept"
        },
        {
          "id": "silhouette",
          "title": "Silhouette balı",
          "kind": "math"
        },
        {
          "id": "simulation",
          "title": "Simulyasiya: k = 1…10",
          "kind": "visualization"
        },
        {
          "id": "python",
          "title": "Python: inertia və silhouette",
          "kind": "python"
        },
        {
          "id": "summary",
          "title": "Xülasə",
          "kind": "summary"
        }
      ],
      "keyConcepts": [
        "elbow-method",
        "silhouette-score",
        "inertia"
      ],
      "interactiveDemoReferences": [
        "kmeans-elbow"
      ],
      "codeExampleIds": [
        "ch08.code.choosing-k"
      ],
      "quizId": "ch08.quiz.choosing-k",
      "exerciseIds": [
        "ch08.ex.silhouette"
      ]
    },
    {
      "id": "ch08.kmeans-applications",
      "slug": "kmeans-applications",
      "title": "k-means-in məhdudiyyətləri və tətbiqləri",
      "description": "k-means harada uğursuz olur və harada parlayır: rəng seqmentasiyası və 50 etiketlə yarı-nəzarətli öyrənmə.",
      "type": "code-lab",
      "estimatedDuration": 30,
      "difficulty": "intermediate",
      "status": "published",
      "tags": [
        "image segmentation",
        "semi-supervised",
        "label propagation"
      ],
      "prerequisites": [
        {
          "kind": "lesson",
          "lessonId": "ch08.choosing-k"
        }
      ],
      "learningObjectives": [
        {
          "id": "ch08.kmeans-applications.obj1",
          "text": "k-means-in məhdudiyyətlərini tanımaq",
          "level": "understand"
        },
        {
          "id": "ch08.kmeans-applications.obj2",
          "text": "Klasterləşdirməni seqmentasiya və yarı-nəzarətli öyrənmə üçün tətbiq etmək",
          "level": "apply"
        }
      ],
      "sections": [
        {
          "id": "limits",
          "title": "k-means-in məhdudiyyətləri",
          "kind": "common-mistakes"
        },
        {
          "id": "segmentation",
          "title": "Şəkil seqmentasiyası",
          "kind": "case-study"
        },
        {
          "id": "semi-supervised",
          "title": "Yarı-nəzarətli öyrənmə",
          "kind": "step-by-step"
        },
        {
          "id": "python",
          "title": "Python: seqmentasiya və 50 etiket",
          "kind": "python"
        },
        {
          "id": "summary",
          "title": "Xülasə",
          "kind": "summary"
        }
      ],
      "keyConcepts": [
        "image-segmentation",
        "label-propagation",
        "semi-supervised-learning",
        "k-means"
      ],
      "codeExampleIds": [
        "ch08.code.applications"
      ],
      "quizId": "ch08.quiz.applications",
      "exerciseIds": [
        "ch08.ex.active-learning"
      ]
    },
    {
      "id": "ch08.dbscan",
      "slug": "dbscan",
      "title": "DBSCAN və digər klasterləşdirmə alqoritmləri",
      "description": "Sıxlığa əsaslanan klasterləşdirmə: istənilən formalı klasterlər və küy nöqtələri.",
      "type": "visual-simulation",
      "estimatedDuration": 25,
      "difficulty": "intermediate",
      "status": "published",
      "tags": [
        "DBSCAN",
        "eps",
        "min_samples"
      ],
      "prerequisites": [
        {
          "kind": "lesson",
          "lessonId": "ch08.kmeans-applications"
        }
      ],
      "learningObjectives": [
        {
          "id": "ch08.dbscan.obj1",
          "text": "DBSCAN-ın əsas, sərhəd və küy nöqtələrini necə müəyyən etdiyini izah etmək",
          "level": "understand"
        },
        {
          "id": "ch08.dbscan.obj2",
          "text": "ε və min_samples-ı tənzimləmək",
          "level": "apply"
        }
      ],
      "sections": [
        {
          "id": "idea",
          "title": "Sıxlıq ideyası",
          "kind": "concept"
        },
        {
          "id": "simulation",
          "title": "Simulyasiya: ε və min_samples",
          "kind": "visualization"
        },
        {
          "id": "predict",
          "title": "Yeni nöqtələr üçün proqnoz",
          "kind": "step-by-step"
        },
        {
          "id": "others",
          "title": "Digər alqoritmlər",
          "kind": "concept"
        },
        {
          "id": "python",
          "title": "Python: DBSCAN və k-means",
          "kind": "python"
        },
        {
          "id": "summary",
          "title": "Xülasə",
          "kind": "summary"
        }
      ],
      "keyConcepts": [
        "dbscan",
        "core-instance",
        "clustering"
      ],
      "interactiveDemoReferences": [
        "dbscan"
      ],
      "codeExampleIds": [
        "ch08.code.dbscan"
      ],
      "quizId": "ch08.quiz.dbscan",
      "exerciseIds": [
        "ch08.ex.dbscan-eps"
      ]
    },
    {
      "id": "ch08.gmm",
      "slug": "gaussian-mixtures",
      "title": "Qauss qarışıqları və anomaliyaların aşkarlanması",
      "description": "Klasterlərin ehtimal modeli: EM alqoritmi, BIC ilə model seçimi, Bayes GMM və anomaliya aşkarlanması üsulları.",
      "type": "visual-simulation",
      "estimatedDuration": 40,
      "difficulty": "advanced",
      "status": "published",
      "tags": [
        "GaussianMixture",
        "EM",
        "BIC",
        "IsolationForest"
      ],
      "prerequisites": [
        {
          "kind": "lesson",
          "lessonId": "ch08.dbscan"
        }
      ],
      "learningObjectives": [
        {
          "id": "ch08.gmm.obj1",
          "text": "GMM-in generativ modelini və EM alqoritmini izah etmək",
          "level": "understand"
        },
        {
          "id": "ch08.gmm.obj2",
          "text": "BIC/AIC ilə komponent sayını seçmək",
          "level": "apply"
        },
        {
          "id": "ch08.gmm.obj3",
          "text": "Sıxlıq modeli və digər üsullarla anomaliyaları aşkar etmək",
          "level": "apply"
        }
      ],
      "sections": [
        {
          "id": "model",
          "title": "Qauss qarışıq modeli",
          "kind": "math"
        },
        {
          "id": "em",
          "title": "EM alqoritmi",
          "kind": "step-by-step"
        },
        {
          "id": "simulation",
          "title": "Simulyasiya: ellipslər, BIC və anomaliyalar",
          "kind": "visualization"
        },
        {
          "id": "selecting",
          "title": "Komponent sayının seçimi",
          "kind": "math"
        },
        {
          "id": "anomaly",
          "title": "Anomaliya və yenilik aşkarlanması",
          "kind": "concept"
        },
        {
          "id": "python",
          "title": "Python: GaussianMixture və IsolationForest",
          "kind": "python"
        },
        {
          "id": "summary",
          "title": "Xülasə",
          "kind": "summary"
        }
      ],
      "keyConcepts": [
        "gaussian-mixture-model",
        "expectation-maximization",
        "bic",
        "bayesian-gaussian-mixture",
        "anomaly-detection",
        "novelty-detection",
        "isolation-forest"
      ],
      "interactiveDemoReferences": [
        "gmm-anomaly"
      ],
      "codeExampleIds": [
        "ch08.code.gmm"
      ],
      "quizId": "ch08.quiz.gmm",
      "exerciseIds": [
        "ch08.ex.gmm"
      ],
      "resourceIds": [
        "res.sklearn-mixture",
        "res.sklearn-outlier"
      ]
    }
  ]
};
