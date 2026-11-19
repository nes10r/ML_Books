import type { z } from "zod";
import type { interactiveDemoSchema } from "@/lib/schemas";

/**
 * Metadata for every interactive demo. The `id` must match a key in
 * `components/demos/registry.tsx` (enforced by tests).
 */
export const demos: z.input<typeof interactiveDemoSchema>[] = [
  {
    id: "supervision-types",
    title: "Etiketli və etiketsiz məlumat",
    description:
      "Eyni nöqtələr üzərində nəzarətli təsnifatı (ən yaxın mərkəz) və nəzarətsiz klasterləşdirməni (k-means) addım-addım müqayisə edin.",
    kind: "simulation",
    chapterId: "ch01",
    lessonIds: ["ch01.training-supervision"],
    concepts: ["supervised-learning", "unsupervised-learning", "classification", "clustering"],
    estimatedDuration: 8,
    status: "published",
    instructions: [
      "“Nəzarətli” rejimdə qrafikə klikləyin — model yeni nöqtənin sinfini proqnozlaşdıracaq.",
      "“Nəzarətsiz” rejimə keçin və “k-means addımı” düyməsi ilə klasterlərin necə formalaşdığını izləyin.",
    ],
  },
  {
    id: "online-learning",
    title: "Onlayn öyrənmə: məlumat axını",
    description:
      "Nöqtələr bir-bir gəlir və model hər nümunədən sonra stoxastik qradiyent enmə ilə yenilənir. Öyrənmə sürətini dəyişin və konsept sürüşməsini aktivləşdirin.",
    kind: "simulation",
    chapterId: "ch01",
    lessonIds: ["ch01.batch-online"],
    concepts: ["online-learning", "learning-rate", "concept-drift"],
    estimatedDuration: 8,
    status: "published",
    instructions: [
      "“Başlat” düyməsini basın və xəttin məlumata necə uyğunlaşdığını izləyin.",
      "Öyrənmə sürətini çox kiçik və çox böyük edin — fərqi müşahidə edin.",
      "“Konsept sürüşməsi” seçimini aktivləşdirib 60-cı nümunədən sonra nə baş verdiyinə baxın.",
    ],
  },
  {
    id: "model-vs-instance",
    title: "k-NN və xətti reqressiya",
    description:
      "Mənzil sahəsinə görə qiyməti proqnozlaşdırın: nümunə əsaslı (k ən yaxın qonşu) və model əsaslı (xətti reqressiya) yanaşmaları yan-yana müqayisə edin.",
    kind: "simulation",
    chapterId: "ch01",
    lessonIds: ["ch01.instance-model"],
    concepts: ["instance-based-learning", "model-based-learning", "k-nearest-neighbors", "linear-regression"],
    estimatedDuration: 10,
    status: "published",
    instructions: [
      "Sahə sürüşdürücüsü ilə yeni mənzilin ölçüsünü seçin.",
      "k-NN rejimində k-nı dəyişin və hansı qonşuların seçildiyinə baxın.",
      "Model rejimində θ₀ və θ₁ parametrlərinin necə hesablandığını izləyin.",
    ],
  },
  {
    id: "overfitting-polynomial",
    title: "Overfitting və underfitting",
    description:
      "Polinomun dərəcəsini və requlyarlaşdırma gücünü dəyişərək təlim və validasiya xətalarının necə dəyişdiyini görün.",
    kind: "simulation",
    chapterId: "ch01",
    lessonIds: ["ch01.challenges"],
    concepts: ["overfitting", "underfitting", "regularization", "hyperparameter"],
    estimatedDuration: 10,
    status: "published",
    instructions: [
      "Dərəcəni 1-dən 12-yə qədər artırın və validasiya xətasının əvvəlcə azalıb sonra artdığına diqqət edin.",
      "Yüksək dərəcədə requlyarlaşdırmanı (λ) artırın — əyri necə hamarlaşır?",
    ],
  },
  {
    id: "stratified-split",
    title: "Təsadüfi və stratifikasiyalı bölgü",
    description:
      "Bakı mənzilləri məlumatını test və təlim dəstlərinə iki üsulla bölün və rayonların payının necə qorunduğunu müqayisə edin.",
    kind: "simulation",
    chapterId: "ch02",
    lessonIds: ["ch02.test-set"],
    concepts: ["stratified-sampling", "test-set", "sampling-bias"],
    estimatedDuration: 6,
    status: "published",
    instructions: [
      "“Yeni təsadüfi bölgü” düyməsini bir neçə dəfə basın — qırmızı zolaqlar boz zolaqdan nə qədər uzaqlaşır?",
      "Test payını 5%-ə endirin: kiçik test dəstində təsadüfi bölgünün xətası necə dəyişir?",
    ],
  },
  {
    id: "correlation-explorer",
    title: "Korrelyasiya tədqiqatçısı",
    description:
      "Hər əlamətin qiymətlə əlaqəsini səpələnmə qrafiki və Pearson r ilə araşdırın, mənzilləri xəritədə görün və yazı səhvlərinin korrelyasiyaya təsirini yoxlayın.",
    kind: "visualization",
    chapterId: "ch02",
    lessonIds: ["ch02.explore"],
    concepts: ["correlation-coefficient", "feature-engineering", "data-leakage"],
    estimatedDuration: 10,
    status: "published",
    instructions: [
      "Sahəni seçin və “yazı səhvlərini düzəlt” seçimini açıb-bağlayın — r necə dəyişir?",
      "Yeni əlamətlərə baxın: hər birləşmiş əlamət faydalıdırmı?",
      "“Xəritə” rejiminə keçin və qiymətin coğrafiyasını müşahidə edin.",
    ],
  },
  {
    id: "feature-scaling",
    title: "Əlamətlərin miqyaslanması",
    description:
      "Min-max, standartlaşdırma və log çevirmənin paylanmanın formasına, diapazonuna və əyilməsinə təsirini histoqramda müqayisə edin.",
    kind: "visualization",
    chapterId: "ch02",
    lessonIds: ["ch02.prepare"],
    concepts: ["feature-scaling", "min-max-scaling", "standardization"],
    estimatedDuration: 8,
    status: "published",
    instructions: [
      "Sahə əlamətində “Min-max” seçin və yazı səhvlərini saxlayın — əksər qiymətlər hara toplanır?",
      "“Log + standart” seçin: əyilmə göstəricisi necə dəyişir?",
    ],
  },
  {
    id: "grid-search",
    title: "Şəbəkə axtarışı (grid search)",
    description:
      "k-NN modelinin iki hiperparametrini — qonşu sayını və miqyaslama üsulunu — 5 qatlı çarpaz validasiya ilə brauzerdə real vaxtda axtarın.",
    kind: "simulation",
    chapterId: "ch02",
    lessonIds: ["ch02.fine-tune"],
    concepts: ["grid-search", "hyperparameter", "cross-validation", "feature-scaling"],
    estimatedDuration: 8,
    status: "published",
    instructions: [
      "“Axtarışı başlat” düyməsini basın — 24 kombinasiya × 5 qat hesablanacaq.",
      "Ən yaxşı xananı tapın və miqyaslamasız sətirlə müqayisə edin.",
      "Xanalara klikləyib qatlar arası yayılmaya baxın: fərq statistik cəhətdən etibarlıdırmı?",
    ],
  },
  {
    id: "threshold-explorer",
    title: "Qərar həddi və precision/recall",
    description:
      "“5-dirmi?” təsnifatçısının balları üzərində qərar həddini dəyişin və qarışıqlıq matrisi, precision, recall və PR əyrisindəki dəyişikliyi canlı izləyin.",
    kind: "simulation",
    chapterId: "ch03",
    lessonIds: ["ch03.precision-recall"],
    concepts: ["decision-threshold", "precision", "recall", "precision-recall-tradeoff", "confusion-matrix"],
    estimatedDuration: 8,
    status: "published",
    instructions: [
      "Həddi sağa çəkin: hansı metrika artır, hansı azalır?",
      "Precision-u 98%-dən yuxarı saxlayan ən kiçik həddi tapın. Recall nə qədərdir?",
      "Təsadüfi meşə modelinə keçin və eyni təcrübəni təkrarlayın.",
    ],
  },
  {
    id: "roc-compare",
    title: "ROC əyrisi: iki modelin müqayisəsi",
    description:
      "SGD və təsadüfi meşənin ROC əyrilərini, AUC və AP göstəricilərini müqayisə edin. İcazə verilən yanlış həyəcan nisbətində hansı model daha çox 5 tutur?",
    kind: "visualization",
    chapterId: "ch03",
    lessonIds: ["ch03.roc"],
    concepts: ["roc-curve", "auc", "recall"],
    estimatedDuration: 6,
    status: "published",
    instructions: [
      "FPR sürüşdürücüsünü 1%-ə qoyun və iki modelin TPR-ni müqayisə edin.",
      "Nöqtələrin əyri boyunca necə hərəkət etdiyinə baxın — hər nöqtə bir hədddir.",
    ],
  },
  {
    id: "digit-draw",
    title: "Rəqəm çəkin — model tanısın",
    description:
      "8×8 lövhəyə rəqəm çəkin və ya test şəkli yükləyin. k-NN təsnifatçısı 1 437 təlim şəkli arasında ən oxşarlarını tapıb səsverməyə qoyur.",
    kind: "simulation",
    chapterId: "ch03",
    lessonIds: ["ch03.multiclass"],
    concepts: ["multiclass-classification", "k-nearest-neighbors"],
    estimatedDuration: 8,
    status: "published",
    instructions: [
      "“Test şəkli” düyməsini bir neçə dəfə basın — model səhv edəndə qonşulara baxın.",
      "Lövhəni təmizləyib öz rəqəminizi çəkin. 1 və 7, 3 və 8 kimi oxşar rəqəmləri sınayın.",
      "k-nı 1-dən 15-ə qədər dəyişin: qərar necə dəyişir?",
    ],
  },
  {
    id: "confusion-explorer",
    title: "Çoxsinifli qarışıqlıq matrisi",
    description:
      "10 sinifli təsnifatçının səhvlərini interaktiv qarışıqlıq matrisində araşdırın və istənilən xananın arxasındakı real səhv şəkillərə baxın.",
    kind: "visualization",
    chapterId: "ch03",
    lessonIds: ["ch03.error-analysis"],
    concepts: ["confusion-matrix", "multiclass-classification"],
    estimatedDuration: 8,
    status: "published",
    instructions: [
      "“Yalnız səhvlər %” rejimində ən tünd xananı tapın.",
      "Xanaya klikləyin və səhv təsnif edilmiş şəkillərə baxın. Onları siz düzgün tanıyardınızmı?",
    ],
  },
  {
    id: "gradient-descent",
    title: "Qradiyent enmə: xərc səthi",
    description:
      "Xərc funksiyasının (θ₀, θ₁) səthi üzərində qradiyent enmənin yolunu izləyin. Öyrənmə sürətini dəyişin və əlaməti standartlaşdırmanın “dar dərəni” necə dəyirmi çuxura çevirdiyini görün.",
    kind: "simulation",
    chapterId: "ch04",
    lessonIds: ["ch04.gradient-descent"],
    concepts: ["gradient-descent", "learning-rate", "feature-scaling", "cost-function"],
    estimatedDuration: 8,
    status: "published",
    instructions: [
      "Standart parametrlərlə “Başlat” düyməsini basın — yol niyə əyri və yavaşdır?",
      "η-nı 0.03-dən yuxarı qaldırın: nə baş verir?",
      "“Əlaməti standartlaşdır” seçimini yandırın, η = 0.1 seçin və yenidən başladın.",
    ],
  },
  {
    id: "gd-variants",
    title: "Paket, mini-paket və stoxastik GD",
    description:
      "Üç qradiyent enmə variantının yollarını eyni xərc səthində müqayisə edin: yeniləmə sayı, yolun “titrəməsi” və öyrənmə cədvəlinin təsiri.",
    kind: "simulation",
    chapterId: "ch04",
    lessonIds: ["ch04.sgd"],
    concepts: ["batch-gradient-descent", "stochastic-gradient-descent", "mini-batch-gradient-descent", "learning-schedule", "epoch"],
    estimatedDuration: 8,
    status: "published",
    instructions: [
      "1 epoxa ilə başlayın: hansı variant minimuma ən yaxındır?",
      "Öyrənmə cədvəlini söndürün və epoxa sayını 20-yə qaldırın — stoxastik yol necə davranır?",
    ],
  },
  {
    id: "learning-curves",
    title: "Öyrənmə əyriləri",
    description:
      "Polinomun dərəcəsini seçin və təlim dəstinin ölçüsü artdıqca təlim və validasiya xətalarının necə dəyişdiyini görün — underfitting və overfitting-in “barmaq izləri”.",
    kind: "simulation",
    chapterId: "ch04",
    lessonIds: ["ch04.polynomial"],
    concepts: ["learning-curve", "polynomial-regression", "bias-variance-tradeoff", "overfitting", "underfitting"],
    estimatedDuration: 8,
    status: "published",
    instructions: [
      "Dərəcə 1: əyrilər hara çatır? Daha çox məlumat kömək edərdimi?",
      "Dərəcə 10: m = 10 və m = 80 olduqda validasiya xətasını müqayisə edin.",
      "Dərəcə 2-də əyrilərin küy səviyyəsinə (0.8) yaxınlaşdığına baxın.",
    ],
  },
  {
    id: "regularization-paths",
    title: "Requlyarlaşdırma yolları",
    description:
      "α artdıqca Ridge, Lasso və Elastic Net əmsallarının necə dəyişdiyini izləyin. 8 əlamətdən 4-ü faydasızdır — hansı üsul onları tapır?",
    kind: "visualization",
    chapterId: "ch04",
    lessonIds: ["ch04.regularization"],
    concepts: ["ridge-regression", "lasso-regression", "elastic-net", "regularization"],
    estimatedDuration: 8,
    status: "published",
    instructions: [
      "Lasso seçin və α-nı tədricən artırın: əmsallar hansı sırayla sıfırlanır?",
      "Ridge-ə keçin: hər hansı əmsal tam sıfır olurmu?",
    ],
  },
  {
    id: "logistic-boundary",
    title: "Logistik reqressiya: qərar sərhədi",
    description:
      "Oxuma və yuxu saatına görə imtahandan keçmə ehtimalını öyrənən logistik reqressiyanı addım-addım öyrədin. Ehtimal xəritəsini və xətti qərar sərhədini izləyin.",
    kind: "simulation",
    chapterId: "ch04",
    lessonIds: ["ch04.logistic"],
    concepts: ["logistic-regression", "sigmoid", "log-loss", "decision-boundary"],
    estimatedDuration: 8,
    status: "published",
    instructions: [
      "“Öyrət” düyməsini basın və log itkinin 0.693-dən necə azaldığını izləyin.",
      "λ-nı artırıb yenidən öyrədin: keçid zonası necə dəyişir?",
    ],
  },
  {
    id: "tree-builder",
    title: "Qərar ağacı qurucusu",
    description:
      "Meyvələri diametr və çəkiyə görə təsnif edən qərar ağacını brauzerdə öyrədin. Bölgələri, ağac diaqramını və istənilən nöqtənin proqnoz yolunu görün.",
    kind: "simulation",
    chapterId: "ch05",
    lessonIds: ["ch05.train"],
    concepts: ["decision-tree", "gini-impurity", "leaf-node"],
    estimatedDuration: 10,
    status: "published",
    instructions: [
      "Qrafikin istənilən yerinə klikləyin: ağacda hansı düyünlərdən keçən yol işıqlanır?",
      "max_depth-i 1-dən 10-a qədər artırın: bölgələr necə dəyişir?",
      "min_samples_leaf-i 15-ə qaldırın: ağac necə sadələşir?",
    ],
  },
  {
    id: "split-finder",
    title: "Ən yaxşı bölgünün axtarışı",
    description:
      "CART-ın kök düyündə etdiyi işi əl ilə edin: hər hədd üçün sol və sağ tərəfin Gini qeyri-müəyyənliyini və onların çəkili ortasını izləyin.",
    kind: "simulation",
    chapterId: "ch05",
    lessonIds: ["ch05.cart"],
    concepts: ["cart-algorithm", "gini-impurity", "entropy"],
    estimatedDuration: 8,
    status: "published",
    instructions: [
      "Həddi sürüşdürün və çəkili Gini əyrisindəki qara nöqtəni izləyin.",
      "“Ən yaxşı həddə keç” düyməsini basın — sonra çəki əlamətinə keçib eyni şeyi edin. Hansı əlamət daha yaxşı kök bölgüsü verir?",
    ],
  },
  {
    id: "tree-regularization",
    title: "Ağacın requlyarlaşdırılması",
    description:
      "max_depth və min_samples_leaf-in “aylar” məlumatında qərar sərhədinə, yarpaq sayına, təlim və validasiya dəqiqliyinə təsirini müqayisə edin.",
    kind: "simulation",
    chapterId: "ch05",
    lessonIds: ["ch05.regularization"],
    concepts: ["decision-tree", "regularization", "overfitting", "nonparametric-model"],
    estimatedDuration: 8,
    status: "published",
    instructions: [
      "Məhdudiyyətsiz ağacla (None) başlayın: təlim dəqiqliyi nə qədərdir? Xırda “adalara” baxın.",
      "min_samples_leaf-i 8-ə qaldırın: validasiya dəqiqliyi necə dəyişir?",
    ],
  },
  {
    id: "regression-tree",
    title: "Reqressiya ağacı",
    description:
      "Gün ərzində temperaturu proqnozlaşdıran reqressiya ağacının pilləli proqnozunu, MSE ilə seçilən hədləri və overfitting-i izləyin.",
    kind: "simulation",
    chapterId: "ch05",
    lessonIds: ["ch05.regression"],
    concepts: ["decision-tree", "regression"],
    estimatedDuration: 8,
    status: "published",
    instructions: [
      "max_depth = 1, 2, 3: pillələrin sayı necə artır?",
      "None seçin və təlim/test RMSE-ni müqayisə edin, sonra min_samples_leaf-i 10-a qaldırın.",
    ],
  },
  {
    id: "tree-instability",
    title: "Ağacların məhdudiyyətləri",
    description:
      "İki təcrübə: mail sərhəddə ağacın “pilləkən” qurmağa məcbur olması və məlumatın kiçik dəyişikliyində ağacın kəskin dəyişməsi (yüksək dispersiya).",
    kind: "simulation",
    chapterId: "ch05",
    lessonIds: ["ch05.limitations"],
    concepts: ["decision-tree", "bias-variance-tradeoff"],
    estimatedDuration: 8,
    status: "published",
    instructions: [
      "“Ox istiqaməti” rejimində bucağı 0°-dən 45°-yə çevirin və yarpaq sayını izləyin.",
      "“Yüksək dispersiya” rejimində bir neçə dəfə yeni alt-nümunə seçin — kök bölgüsü və bölgələr necə dəyişir?",
    ],
  },
  {
    id: "voting-wisdom",
    title: "Kütlənin müdrikliyi",
    description:
      "Hər biri təsadüfi təxmindən bir az yaxşı olan çoxlu təsnifatçının səs çoxluğu nə qədər dəqiqdir? Müstəqil və korrelyasiyalı səhvləri müqayisə edin.",
    kind: "simulation",
    chapterId: "ch06",
    lessonIds: ["ch06.voting"],
    concepts: ["ensemble-learning", "hard-voting", "weak-learner"],
    estimatedDuration: 6,
    status: "published",
    instructions: [
      "p = 55%, korrelyasiya 0 olduqda təsnifatçı sayını 1-dən 1001-ə qaldırın.",
      "Korrelyasiyanı 0.5-ə qaldırın: 1001 təsnifatçı ilə dəqiqlik necə dəyişir?",
    ],
  },
  {
    id: "bagging-forest",
    title: "Bagging, təsadüfi meşə və Extra-Trees",
    description:
      "“Aylar” məlumatında 1-dən 100-ə qədər ağacın birləşdirilməsini izləyin: qərar bölgələri, test dəqiqliyi və OOB qiymətləndirmə.",
    kind: "simulation",
    chapterId: "ch06",
    lessonIds: ["ch06.bagging", "ch06.random-forests"],
    concepts: ["bagging", "random-forest", "extra-trees", "out-of-bag-evaluation"],
    estimatedDuration: 8,
    status: "published",
    instructions: [
      "Ağac sayını 1-dən 100-ə qaldırın və bölgələrin necə hamarlandığına baxın.",
      "Üç ansambl növünü müqayisə edin: OOB və test dəqiqliyi bir-birinə nə qədər yaxındır?",
    ],
  },
  {
    id: "gradient-boosting",
    title: "Qradiyent bustinqi addım-addım",
    description:
      "Hər yeni reqressiya ağacı əvvəlki ansamblın qalıqlarını öyrənir. Öyrənmə sürətini, ağacın dərinliyini və ağac sayını dəyişərək təlim və test xətasını izləyin.",
    kind: "simulation",
    chapterId: "ch06",
    lessonIds: ["ch06.boosting"],
    concepts: ["gradient-boosting", "shrinkage", "boosting"],
    estimatedDuration: 10,
    status: "published",
    instructions: [
      "Ağac sayını 0, 1, 2, 3… addımlarla artırın: qalıqlar necə kiçilir?",
      "η = 1 və η = 0.1 ilə ən yaxşı test nöqtəsini müqayisə edin.",
    ],
  },
  {
    id: "curse-dimensionality",
    title: "Ölçü lənəti",
    description:
      "Vahid hiperkubda təsadüfi nöqtələr: ölçü artdıqca nöqtələrin kənara yaxınlaşmasını və məsafələrin bir-birinə bənzəməsini görün.",
    kind: "visualization",
    chapterId: "ch07",
    lessonIds: ["ch07.curse"],
    concepts: ["curse-of-dimensionality"],
    estimatedDuration: 5,
    status: "published",
    instructions: [
      "Ölçünü 2-dən 1000-ə qaldırın və məsafə histoqramının formasına baxın.",
    ],
  },
  {
    id: "pca-projection",
    title: "PCA: ən yaxşı oxu tapın",
    description:
      "2D nöqtələri bir xəttə proyeksiya edin və hansı istiqamətin dispersiyanı maksimum saxladığını əl ilə tapın, sonra PCA ilə müqayisə edin.",
    kind: "simulation",
    chapterId: "ch07",
    lessonIds: ["ch07.pca"],
    concepts: ["pca", "principal-component", "explained-variance-ratio"],
    estimatedDuration: 6,
    status: "published",
    instructions: [
      "Oxu fırladın və proyeksiyanın dispersiyasını izləyin.",
      "“Birinci əsas komponentə keç” düyməsi ilə nəticəni yoxlayın.",
    ],
  },
  {
    id: "pca-compression",
    title: "Rəqəmlərin PCA ilə sıxılması",
    description:
      "1 797 rəqəm şəklinin PCA-sı brauzerdə hesablanır. Komponent sayını dəyişərək şəkillərin bərpasını, izah olunan dispersiyanı və “məxsusi rəqəmləri” görün.",
    kind: "simulation",
    chapterId: "ch07",
    lessonIds: ["ch07.pca-practice"],
    concepts: ["pca", "reconstruction-error", "explained-variance-ratio"],
    estimatedDuration: 8,
    status: "published",
    instructions: [
      "d = 1, 5, 10, 29 komponentlə bərpanı müqayisə edin.",
      "Kumulyativ dispersiya əyrisində 95% xəttini tapın.",
    ],
  },
  {
    id: "kmeans-steps",
    title: "k-means addım-addım",
    description:
      "Təyinat və yeniləmə addımlarını bir-bir izləyin. Təsadüfi və k-means++ inisializasiyasını, pis yerli minimumları və inertia-nı müqayisə edin.",
    kind: "simulation",
    chapterId: "ch08",
    lessonIds: ["ch08.kmeans"],
    concepts: ["k-means", "centroid", "inertia", "k-means-plus-plus"],
    estimatedDuration: 8,
    status: "published",
    instructions: [
      "Təsadüfi başlanğıcla “Yeni başlanğıc”ı bir neçə dəfə basın və pis nəticə tapın.",
      "k-means++-a keçin və eyni təcrübəni təkrarlayın.",
    ],
  },
  {
    id: "kmeans-elbow",
    title: "k-nın seçimi: dirsək və silhouette",
    description:
      "k = 1…10 üçün inertia və silhouette balını müqayisə edin və hansı k-nın məlumata ən uyğun olduğunu tapın.",
    kind: "visualization",
    chapterId: "ch08",
    lessonIds: ["ch08.choosing-k"],
    concepts: ["elbow-method", "silhouette-score", "inertia"],
    estimatedDuration: 6,
    status: "published",
    instructions: [
      "Inertia əyrisində “dirsəyi” tapın.",
      "Silhouette balının ən yüksək olduğu k-nı müəyyən edin.",
    ],
  },
  {
    id: "dbscan",
    title: "DBSCAN",
    description:
      "Sıxlığa əsaslanan klasterləşdirmə: ε və min_samples dəyişdikcə əsas, sərhəd və küy nöqtələrinin necə dəyişdiyini görün və k-means ilə müqayisə edin.",
    kind: "simulation",
    chapterId: "ch08",
    lessonIds: ["ch08.dbscan"],
    concepts: ["dbscan", "core-instance", "clustering"],
    estimatedDuration: 8,
    status: "published",
    instructions: [
      "ε-u 0.05-dən 0.3-ə qaldırın: klaster sayı necə dəyişir?",
      "k-means rejiminə keçib nəticəni müqayisə edin.",
    ],
  },
  {
    id: "gmm-anomaly",
    title: "Qauss qarışıqları və anomaliyalar",
    description:
      "EM alqoritmi ilə öyrədilmiş Qauss qarışığının ellipslərini, BIC ilə komponent sayının seçimini və aşağı sıxlıqlı nöqtələrin anomaliya kimi aşkarlanmasını izləyin.",
    kind: "simulation",
    chapterId: "ch08",
    lessonIds: ["ch08.gmm"],
    concepts: ["gaussian-mixture-model", "expectation-maximization", "bic", "anomaly-detection"],
    estimatedDuration: 10,
    status: "published",
    instructions: [
      "Komponent sayını 1-dən 5-ə qədər dəyişin və BIC qrafikinə baxın. k = 4-də dördüncü komponent hansı nöqtələri əhatə edir?",
      "Anomaliya həddini dəyişin: hansı nöqtələr ilk olaraq anomaliya sayılır?",
    ],
  },
];
