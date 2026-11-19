import type { z } from "zod";
import type { codeExampleSchema, mediaAssetSchema } from "@/lib/schemas";

const dir = "chapters/03-classification/code";

/** Expected outputs were produced with Python 3.11, numpy 2.4, scikit-learn 1.8. */
export const chapter03CodeExamples: z.input<typeof codeExampleSchema>[] = [
  {
    id: "ch03.code.load-digits",
    title: "Rəqəm məlumatının yüklənməsi",
    description: "load_digits ilə məlumatı yükləmək, bir şəkli mətn qrafikası ilə göstərmək və stratifikasiyalı bölmək.",
    language: "python",
    file: `${dir}/load_digits_data.py`,
    expectedOutput: `X: (1797, 64) | y: (1797,) | piksel diapazonu: 0.0 – 16.0

Birinci şəkil (etiket = 0):
      ::##++      
      ##%%++%%::  
    ..%%..  **==  
    ::**    ====  
    ::==    ++==  
    ::**    **--  
    ..##::++**    
      --##++      

Hər rəqəmin sayı: {0: 178, 1: 182, 2: 177, 3: 183, 4: 181, 5: 182, 6: 181, 7: 179, 8: 174, 9: 180}
Təlim: 1437 şəkil, test: 360 şəkil`,
    chapterId: "ch03",
    lessonId: "ch03.digits",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch03.code.binary",
    title: "İkili təsnifatçı: 5 detektoru",
    description: "SGDClassifier ilə “5-dirmi?” modeli, çarpaz validasiya dəqiqliyi və DummyClassifier ilə müqayisə.",
    language: "python",
    file: `${dir}/binary_classifier.py`,
    expectedOutput: `Təlim dəstində 5-lərin payı: 10.1%
İlk 5 şəklin proqnozu: [ True False  True False False] | həqiqət: [ True False  True False False]
SGD dəqiqliyi (3 qat): [0.983 0.99  0.983]
Dummy dəqiqliyi (3 qat): [0.898 0.9   0.9  ]`,
    chapterId: "ch03",
    lessonId: "ch03.binary",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch03.code.confusion",
    title: "Qarışıqlıq matrisi və metrikalar",
    description: "cross_val_predict ilə təmiz proqnozlar, qarışıqlıq matrisi, precision, recall və F1.",
    language: "python",
    file: `${dir}/confusion_matrix_metrics.py`,
    expectedOutput: `Qarışıqlıq matrisi [[TN FP] [FN TP]]:
[[1288    4]
 [  17  128]]
TN=1288  FP=4  FN=17  TP=128

Precision = TP/(TP+FP) = 128/(128+4) = 0.970
Recall    = TP/(TP+FN) = 128/(128+17) = 0.883
F1        = 0.924`,
    chapterId: "ch03",
    lessonId: "ch03.confusion",
    libraries: ["scikit-learn"],
  },
  {
    id: "ch03.code.threshold",
    title: "Qərar həddinin seçilməsi",
    description: "decision_function balları, müxtəlif hədlər və precision ≥ 98% verən həddin tapılması.",
    language: "python",
    file: `${dir}/threshold_tradeoff.py`,
    expectedOutput: `İlk 5 bal: [-2293.4 -3785.2  1054.1 -3770.6 -4051.5]
hədd= -500: precision=0.288 recall=0.972 müsbət proqnoz=490
hədd=    0: precision=0.970 recall=0.883 müsbət proqnoz=132
hədd=  500: precision=1.000 recall=0.441 müsbət proqnoz=64

Precision ≥ 98% üçün hədd ≈ 87.3: precision=0.984, recall=0.855`,
    chapterId: "ch03",
    lessonId: "ch03.precision-recall",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch03.code.roc",
    title: "ROC və AUC: iki modelin müqayisəsi",
    description: "SGD və təsadüfi meşə üçün ROC AUC, PR AUC və sabit FPR-də TPR.",
    language: "python",
    file: `${dir}/roc_comparison.py`,
    expectedOutput: `SGD            ROC AUC = 0.9807   PR AUC (AP) = 0.9465   FPR=1% olduqda TPR = 0.910
Təsadüfi meşə  ROC AUC = 0.9952   PR AUC (AP) = 0.9881   FPR=1% olduqda TPR = 0.986`,
    chapterId: "ch03",
    lessonId: "ch03.roc",
    libraries: ["scikit-learn"],
  },
  {
    id: "ch03.code.multiclass",
    title: "Çoxsinifli təsnifat",
    description: "SVC (daxildə OvO), OneVsRestClassifier və miqyaslamanın SGD-yə təsiri.",
    language: "python",
    file: `${dir}/multiclass.py`,
    expectedOutput: `SVC: sinif sayı = 10 | ilk şəkil üçün ballar: [[ 5.09  1.79  2.82  6.23  0.71  9.29 -0.29  3.87  7.23  8.28]]
Proqnoz: [5] | həqiqət: [5]
OvR daxilindəki təsnifatçı sayı: 10
SGD (xam)              CV dəqiqliyi = 0.922
SGD + StandardScaler   CV dəqiqliyi = 0.943
SVC                    CV dəqiqliyi = 0.983`,
    chapterId: "ch03",
    lessonId: "ch03.multiclass",
    libraries: ["scikit-learn"],
  },
  {
    id: "ch03.code.error-analysis",
    title: "Səhvlərin təhlili",
    description: "Sinif üzrə recall və ən çox qarışdırılan rəqəm cütləri.",
    language: "python",
    file: `${dir}/error_analysis.py`,
    expectedOutput: `Ümumi dəqiqlik: 0.943  (səhv sayı: 82)

Hər rəqəm üzrə recall:
  0:0.99  1:0.93  2:0.92  3:0.93  4:0.94  5:0.94  6:0.96  7:0.97  8:0.95  9:0.91

Ən çox qarışdırılan cütlər (həqiqət → proqnoz):
  2 → 8: 7 dəfə (4.9% — 2 rəqəmlərinin)
  1 → 8: 6 dəfə (4.1% — 1 rəqəmlərinin)
  9 → 8: 5 dəfə (3.5% — 9 rəqəmlərinin)
  9 → 3: 5 dəfə (3.5% — 9 rəqəmlərinin)
  5 → 9: 5 dəfə (3.4% — 5 rəqəmlərinin)`,
    chapterId: "ch03",
    lessonId: "ch03.error-analysis",
    libraries: ["numpy", "scikit-learn"],
  },
  {
    id: "ch03.code.multilabel",
    title: "Çoxetiketli və çoxçıxışlı təsnifat",
    description: "k-NN ilə iki etiketli təsnifat, macro/weighted F1 və küylü şəkillərin təmizlənməsi.",
    language: "python",
    file: `${dir}/multilabel_multioutput.py`,
    expectedOutput: `Rəqəm 5 → [böyük, tək] = [False  True]
F1 (macro, etiketlər bərabər çəkili):   0.978
F1 (weighted, dəstəyə görə çəkili):     0.981

Orta mütləq piksel xətası: küylü 3.35 → təmizlənmiş 1.50`,
    chapterId: "ch03",
    lessonId: "ch03.multilabel",
    libraries: ["numpy", "scikit-learn"],
  },
];

export const chapter03Media: z.input<typeof mediaAssetSchema>[] = [
  {
    id: "ch03.media.confusion-matrix",
    type: "image",
    title: "Qarışıqlıq matrisi və metrikalar",
    src: "/media/ch03/confusion-matrix.svg",
    alt: "2×2 cədvəl: sətirlər həqiqi sinif (5 deyil, 5), sütunlar proqnoz. Xanalar TN=1288, FP=4, FN=17, TP=128. Precision proqnoz “5” sütunu üzrə, recall isə həqiqi “5” sətri üzrə hesablanır.",
    width: 960,
    height: 420,
    caption: "Precision sütun üzrə, recall isə sətir üzrə hesablanır. Rəqəmlər 5 detektorunun çarpaz validasiya nəticəsidir.",
    credit: "Platforma üçün orijinal diaqram",
    license: "CC BY 4.0",
    chapterId: "ch03",
  },
  {
    id: "ch03.media.ovr-ovo",
    type: "image",
    title: "OvR və OvO strategiyaları",
    src: "/media/ch03/ovr-ovo.svg",
    alt: "Sol tərəfdə OvR: hər sinif üçün bir ikili təsnifatçı (0 qalanlara qarşı, 1 qalanlara qarşı və s.), ən yüksək bal qalib gəlir. Sağ tərəfdə OvO: hər sinif cütü üçün bir təsnifatçı (0–1, 0–2, 1–2 və s.), səsvermə ilə qərar.",
    width: 960,
    height: 400,
    caption: "10 rəqəm üçün OvR 10, OvO isə 10·9/2 = 45 ikili təsnifatçı öyrədir.",
    credit: "Platforma üçün orijinal diaqram",
    license: "CC BY 4.0",
    chapterId: "ch03",
  },
];
