import type { z } from "zod";
import type { datasetSchema } from "@/lib/schemas";

export const datasets: z.input<typeof datasetSchema>[] = [
  {
    id: "baku-apartments",
    title: "Bakı mənzilləri",
    description:
      "Bakının 10 rayonu üzrə 2 400 mənzil: sahə, otaq sayı, mərtəbə, tikili növü, təmir, metroya məsafə, kupça və qiymət. Təmizləmə məşqi üçün çatışmayan qiymətlər və bir neçə yazı səhvi saxlanılıb.",
    file: "/data/baku-apartments.csv",
    format: "csv",
    rows: 2400,
    license: "CC BY 4.0",
    provenance:
      "Platforma üçün sintetik yaradılıb; real elanlardan götürülməyib. Qiymət modeli təlim məqsədilə sadələşdirilib, real bazar qiymətlərini əks etdirmir.",
    generator: "scripts/generate_baku_apartments.py",
    chapterIds: ["ch02"],
    columns: [
      { name: "id", type: "id", description: "Sətrin dəyişməz identifikatoru" },
      { name: "rayon", type: "categorical", description: "Bakının inzibati rayonu (10 kateqoriya)" },
      { name: "enlik", type: "numeric", description: "Coğrafi enlik", unit: "°" },
      { name: "uzunluq", type: "numeric", description: "Coğrafi uzunluq", unit: "°" },
      { name: "sahe", type: "numeric", description: "Ümumi sahə (bir neçə yazı səhvi var)", unit: "m²" },
      { name: "otaq_sayi", type: "integer", description: "Otaq sayı (~2% boş)" },
      { name: "mertebe", type: "integer", description: "Mənzilin yerləşdiyi mərtəbə" },
      { name: "bina_mertebe", type: "integer", description: "Binanın mərtəbə sayı" },
      { name: "tikili", type: "categorical", description: "“yeni” və ya “köhnə” tikili" },
      { name: "temir", type: "categorical", description: "“əla”, “orta”, “təmirsiz” (~3% boş)" },
      { name: "metro_mesafe", type: "numeric", description: "Ən yaxın metroya məsafə (~4% boş)", unit: "km" },
      { name: "kupca", type: "binary", description: "Kupça (mülkiyyət sənədi) var: 1, yox: 0" },
      { name: "qiymet", type: "target", description: "Satış qiyməti — proqnozlaşdırılan hədəf", unit: "AZN" },
    ],
  },
  {
    id: "digits-8x8",
    title: "Əlyazma rəqəmlər (8×8)",
    description:
      "1 797 əlyazma rəqəm şəkli (0–9), hər biri 8×8 = 64 piksel, piksel intensivliyi 0 (ağ) – 16 (qara). Scikit-Learn-də load_digits() funksiyası ilə gələn dəstin CSV nüsxəsi.",
    file: "/data/digits-8x8.csv",
    format: "csv",
    rows: 1797,
    license: "CC BY 4.0",
    provenance:
      "UCI Machine Learning Repository — “Optical Recognition of Handwritten Digits” (E. Alpaydin, C. Kaynak). scikit-learn paketindəki nüsxədən yaradılıb.",
    generator: "scripts/generate_digits_data.py",
    chapterIds: ["ch03"],
    columns: [
      { name: "id", type: "id", description: "Sətrin dəyişməz identifikatoru (1–1797)" },
      { name: "label", type: "target", description: "Şəkildəki rəqəm (0–9)" },
      ...Array.from({ length: 64 }, (_, i) => ({
        name: `p${i}`,
        type: "integer" as const,
        description: `Piksel: sətir ${Math.floor(i / 8) + 1}, sütun ${(i % 8) + 1} (0–16)`,
      })),
    ],
  },
  {
    id: "digits-model-outputs",
    title: "Rəqəm modellərinin çıxışları",
    description:
      "Təlim hissəsindəki 1 437 şəkil üçün 3 qatlı cross_val_predict ilə alınmış model çıxışları: “5-dirmi?” üçün SGD balı və təsadüfi meşə ehtimalı, həmçinin 10 sinifli modelin proqnozu.",
    file: "/data/digits-model-outputs.csv",
    format: "csv",
    rows: 1437,
    license: "CC BY 4.0",
    provenance: "digits-8x8 dəstindən scripts/generate_digits_data.py ilə hesablanıb (scikit-learn 1.8, random_state=42).",
    generator: "scripts/generate_digits_data.py",
    chapterIds: ["ch03"],
    columns: [
      { name: "id", type: "id", description: "digits-8x8 dəstindəki şəklin ID-si" },
      { name: "label", type: "target", description: "Həqiqi rəqəm (0–9)" },
      { name: "is_5", type: "binary", description: "Rəqəm 5-dirsə 1, əks halda 0" },
      { name: "sgd_score", type: "numeric", description: "SGDClassifier qərar balı (decision_function)" },
      { name: "forest_proba", type: "numeric", description: "RandomForestClassifier: “5” sinfinin ehtimalı" },
      { name: "multi_pred", type: "integer", description: "StandardScaler + SGDClassifier (10 sinif) proqnozu" },
    ],
  },
];
