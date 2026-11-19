import type { ChapterInput } from "@/lib/schemas";

export const chapter07: ChapterInput = {
  "id": "ch07",
  "slug": "dimensionality-reduction",
  "number": 7,
  "partId": "part-1",
  "title": "Ölçünün azaldılması",
  "description": "Çoxlu əlamətli məlumatın problemləri və həlləri: ölçü lənəti, proyeksiya və manifoldlar, PCA və onun praktiki istifadəsi, təsadüfi proyeksiya, LLE, t-SNE və digər üsullar.",
  "estimatedDuration": 135,
  "difficulty": "intermediate",
  "status": "published",
  "bookReference": {
    "chapter": 7,
    "originalTitle": "Dimensionality Reduction"
  },
  "tags": [
    "PCA",
    "curse of dimensionality",
    "manifold",
    "t-SNE"
  ],
  "prerequisites": [
    {
      "kind": "chapter",
      "chapterId": "ch06"
    },
    {
      "kind": "skill",
      "label": "Vektorlar və proyeksiya",
      "description": "Skalyar hasil, vahid vektor, nöqtənin xəttə proyeksiyası."
    }
  ],
  "learningObjectives": [
    {
      "id": "ch07.obj.curse",
      "text": "Ölçü lənətinin ML-ə təsirini izah etmək",
      "level": "understand"
    },
    {
      "id": "ch07.obj.pca",
      "text": "PCA-nın dispersiyanı saxlayan proyeksiya kimi işləməsini izah etmək və tətbiq etmək",
      "level": "apply"
    },
    {
      "id": "ch07.obj.choose",
      "text": "Ölçü sayını izah olunan dispersiyaya görə seçmək və sıxılmanı qiymətləndirmək",
      "level": "evaluate"
    },
    {
      "id": "ch07.obj.nonlinear",
      "text": "Xətti və qeyri-xətti üsullar (təsadüfi proyeksiya, LLE, t-SNE) arasında seçim etmək",
      "level": "evaluate"
    }
  ],
  "mediaReferences": [
    "ch07.media.projection-manifold"
  ],
  "interactiveDemoReferences": [
    "curse-dimensionality",
    "pca-projection",
    "pca-compression"
  ],
  "githubReferences": [],
  "quizIds": [
    "ch07.quiz.final"
  ],
  "lessons": [
    {
      "id": "ch07.curse",
      "slug": "curse-of-dimensionality",
      "title": "Ölçü lənəti və əsas yanaşmalar",
      "description": "Yüksək ölçülü fəzanın qəribəlikləri və ölçünü azaltmağın iki yolu: proyeksiya və manifold öyrənmə.",
      "type": "visual-simulation",
      "estimatedDuration": 25,
      "difficulty": "intermediate",
      "status": "published",
      "tags": [
        "curse of dimensionality",
        "projection",
        "manifold"
      ],
      "prerequisites": [
        {
          "kind": "chapter",
          "chapterId": "ch06"
        }
      ],
      "learningObjectives": [
        {
          "id": "ch07.curse.obj1",
          "text": "Yüksək ölçülü fəzada məsafələrin davranışını izah etmək",
          "level": "understand"
        },
        {
          "id": "ch07.curse.obj2",
          "text": "Proyeksiya və manifold öyrənməni fərqləndirmək",
          "level": "understand"
        }
      ],
      "sections": [
        {
          "id": "curse",
          "title": "Ölçü lənəti",
          "kind": "concept"
        },
        {
          "id": "simulation",
          "title": "Simulyasiya: hiperkubda nöqtələr",
          "kind": "visualization"
        },
        {
          "id": "approaches",
          "title": "Proyeksiya və manifold öyrənmə",
          "kind": "concept"
        },
        {
          "id": "python",
          "title": "Python: ölçü artdıqca məsafələr",
          "kind": "python"
        },
        {
          "id": "summary",
          "title": "Xülasə",
          "kind": "summary"
        }
      ],
      "keyConcepts": [
        "curse-of-dimensionality",
        "dimensionality-reduction",
        "manifold-learning",
        "manifold-hypothesis"
      ],
      "mediaReferences": [
        "ch07.media.projection-manifold"
      ],
      "interactiveDemoReferences": [
        "curse-dimensionality"
      ],
      "codeExampleIds": [
        "ch07.code.curse"
      ],
      "quizId": "ch07.quiz.curse",
      "exerciseIds": [
        "ch07.ex.curse"
      ]
    },
    {
      "id": "ch07.pca",
      "slug": "pca",
      "title": "PCA: əsas komponentlər analizi",
      "description": "Dispersiyanı saxlayan oxlar, SVD ilə əsas komponentlər və d ölçüyə proyeksiya.",
      "type": "visual-simulation",
      "estimatedDuration": 35,
      "difficulty": "intermediate",
      "status": "published",
      "tags": [
        "PCA",
        "SVD",
        "explained variance"
      ],
      "prerequisites": [
        {
          "kind": "lesson",
          "lessonId": "ch07.curse"
        }
      ],
      "learningObjectives": [
        {
          "id": "ch07.pca.obj1",
          "text": "PCA-nın hansı oxu seçdiyini iki ekvivalent meyarla izah etmək",
          "level": "understand"
        },
        {
          "id": "ch07.pca.obj2",
          "text": "Əsas komponentləri SVD ilə hesablamaq və proyeksiya etmək",
          "level": "apply"
        }
      ],
      "sections": [
        {
          "id": "variance",
          "title": "Dispersiyanın qorunması",
          "kind": "concept"
        },
        {
          "id": "simulation",
          "title": "Simulyasiya: ən yaxşı oxu tapın",
          "kind": "visualization"
        },
        {
          "id": "components",
          "title": "Əsas komponentlər və SVD",
          "kind": "math"
        },
        {
          "id": "projecting",
          "title": "d ölçüyə proyeksiya",
          "kind": "math"
        },
        {
          "id": "python",
          "title": "Python: SVD və Scikit-Learn",
          "kind": "python"
        },
        {
          "id": "summary",
          "title": "Xülasə",
          "kind": "summary"
        }
      ],
      "keyConcepts": [
        "pca",
        "principal-component",
        "svd",
        "explained-variance-ratio"
      ],
      "interactiveDemoReferences": [
        "pca-projection"
      ],
      "codeExampleIds": [
        "ch07.code.pca"
      ],
      "quizId": "ch07.quiz.pca",
      "exerciseIds": [
        "ch07.ex.pca-manual"
      ],
      "resourceIds": [
        "res.sklearn-decomposition"
      ]
    },
    {
      "id": "ch07.pca-practice",
      "slug": "pca-in-practice",
      "title": "PCA praktikada: ölçünün seçimi və sıxılma",
      "description": "Neçə komponent saxlamalı, PCA ilə sıxılma və bərpa, böyük məlumat üçün randomized və incremental PCA.",
      "type": "visual-simulation",
      "estimatedDuration": 30,
      "difficulty": "intermediate",
      "status": "published",
      "tags": [
        "n_components",
        "inverse_transform",
        "IncrementalPCA"
      ],
      "prerequisites": [
        {
          "kind": "lesson",
          "lessonId": "ch07.pca"
        }
      ],
      "learningObjectives": [
        {
          "id": "ch07.pca-practice.obj1",
          "text": "İzah olunan dispersiyaya görə ölçü sayını seçmək",
          "level": "apply"
        },
        {
          "id": "ch07.pca-practice.obj2",
          "text": "PCA ilə sıxılma və bərpa xətasını qiymətləndirmək",
          "level": "evaluate"
        },
        {
          "id": "ch07.pca-practice.obj3",
          "text": "Randomized və incremental PCA-nın nə vaxt lazım olduğunu izah etmək",
          "level": "understand"
        }
      ],
      "sections": [
        {
          "id": "choosing",
          "title": "Ölçü sayının seçimi",
          "kind": "step-by-step"
        },
        {
          "id": "compression",
          "title": "PCA ilə sıxılma və bərpa",
          "kind": "math"
        },
        {
          "id": "simulation",
          "title": "Simulyasiya: rəqəmlərin sıxılması",
          "kind": "visualization"
        },
        {
          "id": "scaling-up",
          "title": "Randomized və incremental PCA",
          "kind": "concept"
        },
        {
          "id": "python",
          "title": "Python: rəqəmlərdə PCA",
          "kind": "python"
        },
        {
          "id": "summary",
          "title": "Xülasə",
          "kind": "summary"
        }
      ],
      "keyConcepts": [
        "explained-variance-ratio",
        "reconstruction-error",
        "randomized-pca",
        "incremental-pca"
      ],
      "interactiveDemoReferences": [
        "pca-compression"
      ],
      "codeExampleIds": [
        "ch07.code.pca-digits"
      ],
      "quizId": "ch07.quiz.pca-practice",
      "exerciseIds": [
        "ch07.ex.compression"
      ]
    },
    {
      "id": "ch07.random-projection",
      "slug": "random-projection",
      "title": "Təsadüfi proyeksiya",
      "description": "Çox yüksək ölçülü məlumatda təsadüfi xətti xəritə ilə məsafələri qoruyaraq ölçünü azaltmaq.",
      "type": "math",
      "estimatedDuration": 20,
      "difficulty": "intermediate",
      "status": "published",
      "tags": [
        "random projection",
        "Johnson–Lindenstrauss"
      ],
      "prerequisites": [
        {
          "kind": "lesson",
          "lessonId": "ch07.pca-practice"
        }
      ],
      "learningObjectives": [
        {
          "id": "ch07.random-projection.obj1",
          "text": "Conson–Lindenştraus lemmasının mənasını izah etmək",
          "level": "understand"
        },
        {
          "id": "ch07.random-projection.obj2",
          "text": "Təsadüfi proyeksiyanı tətbiq etmək",
          "level": "apply"
        }
      ],
      "sections": [
        {
          "id": "idea",
          "title": "Təsadüfi, lakin etibarlı",
          "kind": "concept"
        },
        {
          "id": "jl",
          "title": "Conson–Lindenştraus lemması",
          "kind": "math"
        },
        {
          "id": "python",
          "title": "Python: 10 000 → 1 754 ölçü",
          "kind": "python"
        },
        {
          "id": "summary",
          "title": "Xülasə",
          "kind": "summary"
        }
      ],
      "keyConcepts": [
        "random-projection",
        "johnson-lindenstrauss"
      ],
      "codeExampleIds": [
        "ch07.code.random-projection"
      ],
      "quizId": "ch07.quiz.random-projection",
      "exerciseIds": [
        "ch07.ex.jl"
      ],
      "resourceIds": [
        "res.sklearn-random-projection"
      ]
    },
    {
      "id": "ch07.manifold",
      "slug": "manifold-learning",
      "title": "LLE, t-SNE və digər üsullar",
      "description": "Qeyri-xətti ölçü azaltma: rulonu “açmaq” və yüksək ölçülü məlumatı vizuallaşdırmaq.",
      "type": "theory",
      "estimatedDuration": 25,
      "difficulty": "intermediate",
      "status": "published",
      "tags": [
        "LLE",
        "Isomap",
        "t-SNE",
        "MDS"
      ],
      "prerequisites": [
        {
          "kind": "lesson",
          "lessonId": "ch07.random-projection"
        }
      ],
      "learningObjectives": [
        {
          "id": "ch07.manifold.obj1",
          "text": "LLE-nin iki addımlı məntiqini izah etmək",
          "level": "understand"
        },
        {
          "id": "ch07.manifold.obj2",
          "text": "Vizuallaşdırma və ön emal üçün uyğun üsulu seçmək",
          "level": "evaluate"
        }
      ],
      "sections": [
        {
          "id": "lle",
          "title": "Lokal xətti yerləşdirmə (LLE)",
          "kind": "concept"
        },
        {
          "id": "others",
          "title": "Digər üsullar",
          "kind": "concept"
        },
        {
          "id": "python",
          "title": "Python: rulon və rəqəmlər",
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
        "lle",
        "t-sne",
        "isomap",
        "manifold-learning"
      ],
      "codeExampleIds": [
        "ch07.code.manifold"
      ],
      "quizId": "ch07.quiz.manifold",
      "exerciseIds": [
        "ch07.ex.tsne"
      ],
      "resourceIds": [
        "res.sklearn-manifold"
      ]
    }
  ]
};
