import type { z } from "zod";
import type { exerciseSchema } from "@/lib/schemas";

export const chapter08Exercises: z.input<typeof exerciseSchema>[] = [
  {
    "id": "ch08.ex.kmeans-init",
    "title": "İnisializasiya statistikası",
    "prompt": "kmeans_basics.py-dəki təcrübəni 200 başlanğıcla təkrarlayın və təsadüfi və k-means++ başlanğıcları üçün inertia paylanmasını histoqramla göstərin. n_init = 1, 3, 10 üçün ən yaxşı inertia-nın pis olma ehtimalını hesablayın.",
    "kind": "research",
    "difficulty": "intermediate",
    "estimatedDuration": 30,
    "chapterId": "ch08",
    "lessonId": "ch08.kmeans"
  },
  {
    "id": "ch08.ex.silhouette",
    "title": "Silhouette diaqramı",
    "prompt": "choosing_k.py üçün k = 3, 4, 5, 6 silhouette diaqramlarını çəkin (sklearn.metrics.silhouette_samples). Hər klaster üçün balları sıralayıb “bıçaq” formasında göstərin. Hansı k-da bütün klasterlər orta balın üstündədir?",
    "kind": "coding",
    "difficulty": "intermediate",
    "estimatedDuration": 30,
    "chapterId": "ch08",
    "lessonId": "ch08.choosing-k"
  },
  {
    "id": "ch08.ex.active-learning",
    "title": "Aktiv öyrənmə",
    "prompt": "kmeans_applications.py-dəki yarı-nəzarətli nəticəni yaxşılaşdırın: model ən az əmin olduğu 20 şəkli seçsin (predict_proba-nın maksimumu ən kiçik olanlar), siz onların etiketini əlavə edin (y_train-dən götürün) və modeli yenidən öyrədin. Bu dövrü 5 dəfə təkrarlayın və dəqiqliyi izləyin. 20 təsadüfi əlavə etiketlə müqayisə edin.",
    "kind": "coding",
    "difficulty": "advanced",
    "estimatedDuration": 40,
    "chapterId": "ch08",
    "lessonId": "ch08.kmeans-applications"
  },
  {
    "id": "ch08.ex.dbscan-eps",
    "title": "ε-u məlumatdan seçin",
    "prompt": "“Aylar” məlumatı üçün hər nöqtənin 5-ci ən yaxın qonşusuna məsafəni hesablayın (NearestNeighbors), bu məsafələri sıralayıb qrafikdə göstərin. Əyrinin kəskin qalxdığı nöqtə (“dirsək”) ε üçün yaxşı namizəddir. Seçdiyiniz ε ilə DBSCAN-ın ARI-sini ölçün.",
    "kind": "coding",
    "difficulty": "intermediate",
    "estimatedDuration": 25,
    "chapterId": "ch08",
    "lessonId": "ch08.dbscan"
  },
  {
    "id": "ch08.ex.gmm",
    "title": "Rəqəm şəkillərində anomaliyalar",
    "prompt": "load_digits ilə: PCA(0.99) tətbiq edin, GaussianMixture öyrədin, sonra bəzi şəkilləri döndərin və ya tərsinə çevirin. Dəyişdirilmiş şəkillərin score_samples() qiymətləri normal şəkillərdən aşağıdırmı? Hansı faizlik hədd onları ən yaxşı ayırır?",
    "kind": "research",
    "difficulty": "advanced",
    "estimatedDuration": 40,
    "chapterId": "ch08",
    "lessonId": "ch08.gmm",
    "hints": [
      "Şəkli 8×8 formasına salıb np.rot90 və ya np.fliplr tətbiq edin."
    ]
  }
];
