# ML Akademiya — Praktik Maşın Öyrənməsi

Azərbaycan dilində interaktiv, vizual və mərhələli Machine Learning öyrənmə platforması. Mövzu ardıcıllığı Aurélien Géron-un *Hands-On Machine Learning with Scikit-Learn and PyTorch* (O'Reilly) kitabına əsaslanır. Bütün izahlar, diaqramlar, simulyasiyalar, kodlar və tapşırıqlar orijinal hazırlanıb.

> Memarlıq və data modeli haqqında ətraflı: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Necə işə salmaq olar

Tələblər: **Node.js 20.9+** (22 LTS tövsiyə olunur), npm.

```bash
npm install
npm run dev          # http://localhost:3000 (draft məzmun da görünür)

npm run build        # production build (bütün səhifələr statik yaradılır)
npm start            # production server

npm run typecheck    # tsc --noEmit
npm run lint         # ESLint (next/core-web-vitals + typescript)
npm test             # Vitest (unit, məzmun bütövlüyü, komponent testləri)
npm run check        # typecheck + lint + test
```

Python nümunələri üçün (ixtiyari): `pip install numpy pandas scipy scikit-learn`.

- Fəsil 1: `python src/content/chapters/01-machine-learning-landscape/code/first_model.py`
- Fəsil 2: skriptlər `baku-apartments.csv` faylını **işlədiyi qovluqda** gözləyir, `train_models.py`, `fine_tune.py` və `save_model.py` isə `pipeline.py`-ni idxal edir:
  ```bash
  cd public/data
  PYTHONPATH=../../src/content/chapters/02-end-to-end-project/code python ../../src/content/chapters/02-end-to-end-project/code/train_models.py
  ```
- Fəsil 3: skriptlər scikit-learn-in daxili `load_digits` dəstindən istifadə edir, fayl və internet tələb etmir: `python src/content/chapters/03-classification/code/roc_comparison.py`
- Fəsil 4: skriptlər yalnız NumPy və scikit-learn tələb edir (sintetik məlumat və daxili `load_wine`): `python src/content/chapters/04-training-models/code/regularization.py`
- Fəsil 5: skriptlər eyni qovluqdakı `fruits.py` modulunu idxal edir: `cd src/content/chapters/05-decision-trees/code && python regularization.py`
- Fəsil 6–8: skriptlər müstəqildir və yalnız NumPy + scikit-learn tələb edir (sintetik məlumat və daxili `load_digits`): `python src/content/chapters/06-ensemble-learning/code/random_forest.py`, `python src/content/chapters/07-dimensionality-reduction/code/pca_digits.py`, `python src/content/chapters/08-unsupervised-learning/code/dbscan.py`. `manifold.py` (t-SNE) bir neçə saniyə çəkə bilər.
- Məlumat dəstlərini yenidən yaratmaq: `python scripts/generate_baku_apartments.py`, `python scripts/generate_digits_data.py`

## Hazır funksiyalar (Implemented)

- **Scaffold:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4, shadcn/ui yanaşması, Lucide, ESLint, Vitest.
- **Global layout və naviqasiya:** sticky header, mobil menyu (drawer), skip-link, footer, işıqlı/qaranlıq tema.
- **Dizayn sistemi:** semantik rəng tokenləri (light/dark), tipoqrafiya (Inter + Source Serif 4 + JetBrains Mono, `latin-ext`), UI primitivləri (Button, Card, Badge, Progress, Sheet, SegmentedControl, SliderField, Skeleton).
- **Məzmun sxemləri:** Course, Part, Chapter, Lesson, LessonSection, ContentBlock, InteractiveDemo, CodeExample, Quiz/Question, Exercise, MediaAsset, GlossaryTerm, LearningObjective, Prerequisite, LearningProgress (Zod + TS tipləri).
- **Build zamanı validasiya:** sxem xətaları + çarpaz istinadlar (mövcud olmayan ID, təkrar ID, səhv prefiks, planned fəsildə dərs və s.).
- **Routing:** `/`, `/curriculum`, `/chapters/[chapterSlug]`, `/chapters/[chapterSlug]/[lessonSlug]`, `/playground`, `/playground/[demoId]`, `/lab`, `/exercises`, `/exercises/[quizId]`, `/glossary`, `/resources`, `/progress`. Hamısı SSG, mövcud olmayan slug üçün 404.
- **Dərs layout-u:** sol panel (kurs → fəsil → dərs, tamamlanma indikatorları), əsas məzmun, sağ panel (scroll-spy ilə “Bu səhifədə”, proqres, əsas anlayışlar, resurslar). Mobil versiyada hər iki panel drawer-dir.
- **Təkrar istifadə olunan dərs komponentləri:** məqsədlər/ön şərtlər, `<Section>`, `<Term>` (ikidilli), `<Callout>`, `<Demo>`, `<PythonExample>`, `<Media>`, KaTeX düsturları, Shiki ilə kod blokları (kopyala və `.py` endir), quiz, praktiki tapşırıqlar (ipucu/həll), əvvəlki/növbəti dərs.
- **Chapter 1 (tam):** 7 dərs, 4 interaktiv simulyasiya (təsnifat və k-means, SGD ilə onlayn öyrənmə və konsept sürüşməsi, k-NN və xətti reqressiya, polinom overfitting və Ridge), 4 yoxlanılmış Python nümunəsi (gözlənilən çıxışla), 8 quiz (25 sual), 8 praktiki tapşırıq, 3 orijinal SVG diaqram, 37 terminli lüğət.
- **Chapter 2 (tam):** 9 dərs (problemin qoyuluşu → məlumat → test dəsti → kəşf → hazırlıq → pipeline-lar → model seçimi → dəqiqləşdirmə → istifadəyə vermə), 4 interaktiv demo (stratifikasiyalı bölgü, korrelyasiya tədqiqatçısı və xəritə, miqyaslama histoqramı, brauzerdə real 5 qatlı CV ilə grid search), 8 yoxlanılmış Python skripti, 10 test (33 sual), 9 praktiki tapşırıq, 2 orijinal SVG diaqram, 23 yeni termin.
- **“Bakı mənzilləri” məlumat dəsti:** orijinal sintetik dəst (2 400 sətir, 13 sütun). Təmizləmə məşqi üçün içində boşluqlar və yazı səhvləri saxlanılıb. Deterministik generator: `scripts/generate_baku_apartments.py`. Brauzer demoları və Python skriptləri eyni CSV-dən istifadə edir.
- **Chapter 3 (tam):** 8 dərs (rəqəm məlumatı → ikili təsnifatçı və dəqiqliyin tələsi → qarışıqlıq matrisi → precision/recall kompromisi → ROC/AUC → çoxsinifli təsnifat → səhvlərin təhlili → çoxetiketli/çoxçıxışlı), 4 interaktiv demo (qərar həddi tədqiqatçısı, ROC müqayisəsi, 8×8 lövhədə rəqəm çəkib tanıtmaq, interaktiv qarışıqlıq matrisi və səhv şəkillər), 8 yoxlanılmış Python skripti, 9 test (30 sual), 8 praktiki tapşırıq, 2 orijinal SVG diaqram, 20 yeni termin.
- **Rəqəm məlumatı:** `digits-8x8.csv` (UCI, CC BY 4.0, scikit-learn `load_digits`) və `digits-model-outputs.csv` (çarpaz validasiya balları və proqnozları). Brauzer demoları Python ilə eyni nəticələri verir (məs. ROC AUC 0.9807 / 0.9952), bunu testlər yoxlayır.
- **Chapter 4 (tam):** 8 dərs (xətti reqressiya → normal tənlik və mürəkkəblik → qradiyent enmə → SGD və mini-paket → polinom reqressiya və öyrənmə əyriləri → Ridge/Lasso/Elastic Net və erkən dayandırma → logistik reqressiya → softmax), 5 interaktiv demo (xərc səthi üzərində GD və miqyaslama, üç GD variantının yarışı, öyrənmə əyriləri, requlyarlaşdırma yolları, logistik qərar sərhədi), 8 yoxlanılmış Python skripti, 9 test (33 sual), 8 praktiki tapşırıq, 2 orijinal SVG diaqram, 22 yeni termin. Lasso həllinin düzgünlüyü testlərdə KKT optimallıq şərtləri ilə, Ridge isə qapalı həll ilə yoxlanılır.
- **Chapter 5 (tam):** 5 dərs (təlim, oxunma və proqnoz → CART, Gini/entropiya və mürəkkəblik → requlyarlaşdırma → reqressiya ağacları → ox istiqaməti və yüksək dispersiya), 5 interaktiv demo (ağac qurucusu və proqnoz yolu, ən yaxşı bölgünün axtarışı, requlyarlaşdırma, reqressiya ağacı, ağacın qeyri-sabitliyi), 6 Python faylı (5 skript + ortaq `fruits.py`), 6 test (22 sual), 5 praktiki tapşırıq, 2 orijinal SVG diaqram, 8 yeni termin. Demolar brauzerdə yazılmış CART alqoritmi ilə işləyir; nəticələri testlərdə scikit-learn ilə rəqəmbərəqəm müqayisə olunur.
- **Chapter 6 (tam):** 5 dərs (səsvermə təsnifatçıları → bagging/pasting və OOB → təsadüfi meşələr, Extra-Trees və əlamət əhəmiyyəti → AdaBoost, qradiyent artırma və HistGB → stacking), 3 interaktiv demo (“kütlənin müdrikliyi” və korrelyasiya, bagging/meşə/Extra-Trees sərhədləri və OOB, qradiyent artırmanın mərhələləri), 5 yoxlanılmış Python skripti, 6 test (24 sual), 5 praktiki tapşırıq, 1 orijinal SVG diaqram, 15 yeni termin.
- **Chapter 7 (tam):** 5 dərs (ölçü lənəti və manifold fərziyyəsi → PCA, SVD və izah olunan dispersiya → ölçü seçimi, sıxılma, randomized/incremental PCA → təsadüfi proyeksiya və Johnson–Lindenstrauss → LLE, t-SNE, Isomap), 3 interaktiv demo (yüksək ölçülərdə məsafələr, oxu fırladaraq PCA, rəqəmlərin PCA ilə sıxılması — real `digits-8x8.csv` üzərində), 5 yoxlanılmış Python skripti, 6 test (23 sual), 5 praktiki tapşırıq, 1 orijinal SVG diaqram, 15 yeni termin. Brauzer PCA-sı (Jacobi) scikit-learn ilə eyni dispersiya paylarını verir (0.1489 / 0.1362 / 0.1179; 95% üçün 29 komponent).
- **Chapter 8 (tam):** 5 dərs (k-means və k-means++ → dirsək və silhouette → məhdudiyyətlər, rəng seqmentasiyası, yarı-nəzarətli öyrənmə → DBSCAN və digər alqoritmlər → Qauss qarışıqları, EM, BIC və anomaliyalar), 4 interaktiv demo (addım-addım k-means, k seçimi, DBSCAN vs k-means, GMM ellipsləri + BIC + anomaliyalar), 5 yoxlanılmış Python skripti, 6 test (24 sual), 5 praktiki tapşırıq, 1 orijinal SVG diaqram, 17 yeni termin. Bununla kitabın I hissəsi tamamlanır.
- **Fəsil 9–19:** struktur metadata (başlıq, təsvir, müddət, çətinlik, kitab istinadı). Kurikulumda “Hazırlanır” kimi aydın işarələnib.
- **Media arxitekturası:** `image`, `video` (altyazılarla), `embed` (YouTube-nocookie/Vimeo) tipləri bir `<Media id>` komponenti ilə.
- **Lokal proqres:** dərs ziyarəti və tamamlanması, quiz cəhdləri və ən yaxşı nəticə, “davam et” düyməsi, proqres səhifəsi, təsdiqlə sıfırlama. `localStorage` + Zod validasiya + tablar arası sinxronizasiya.
- **Əlçatanlıq:** semantik landmark-lar, `aria-current`, klaviatura ilə idarə olunan kontrollar, `role="img"` + təsviri olan qrafiklər, `aria-live` nəticələr, rəngdən asılı olmayan markerlər, `prefers-reduced-motion`.
- **Testlər (322):** ansambllar (səsvermə nəzəriyyəsi, OOB, Extra-Trees, qradiyent artırma), PCA (scikit-learn ilə uyğunluq), k-means++/silhouette/DBSCAN/EM, Chapter 6–8 demoları, CART (scikit-learn ilə uyğunluq), Chapter 5 demoları, qradiyent enmə, koordinat enməsi (KKT), logistik reqressiya, Chapter 4 demolarının animasiya testləri, təsnifat metrikaları (TP/FP, precision, recall, F1, ROC AUC, AP), Chapter 3 demolarının Python nəticələri ilə uyğunluğu, CSV parser, statistika, bölgü və CV funksiyaları, dataset faylının sxemə uyğunluğu, Chapter 2 demolarının real məlumatla smoke testləri, həmçinin: ML alqoritmləri, məzmun bütövlüyü (MDX ↔ metadata), validator, sxemlər, proqres, quiz məntiqi və komponenti, lüğət axtarışı, demoların smoke testləri.

## Gözləyən funksiyalar (Pending)

Bunlar **implementasiya edilməyib** (inteqrasiya planı üçün [ARCHITECTURE.md §6](docs/ARCHITECTURE.md#6-gələcək-genişlənmə-nöqtələri)):

- Fəsil 9–19-un məzmunu
- Tələbə/müəllim hesabları, autentifikasiya, proqresin serverə sinxronlaşdırılması
- Brauzerdə Python icrası (Pyodide) və ya server icra xidməti; Jupyter/Colab inteqrasiyası
- Tapşırıq təhvili, müəllim rəyi, müəllim paneli, quiz analitikası
- Video dərslər (arxitektura hazırdır, məzmun yoxdur), sertifikatlar, ödənişli/özəl giriş
- AI müəllim köməkçisi
- Çoxdillilik (UI mətnləri artıq bir lüğətdə toplanıb)
- Sayt daxili tam mətn axtarışı

## Memarlıq qərarları (qısa)

1. **Content-driven:** məzmun `src/content/`-dədir. Komponentlərdə kurs mətni yoxdur, UI mətnləri isə `src/lib/i18n/az.ts`-dədir.
2. **Tək qeydiyyat nöqtəsi:** `src/content/registry.ts`. Yeni fəsil layout, routing və naviqasiya kodunu dəyişmədən əlavə olunur.
3. **Repository qatı:** səhifələr məzmunu yalnız `lib/content/repository.ts` vasitəsilə oxuyur.
4. **Build zamanı validasiya:** səhv istinad build-i dayandırır. İstifadəçi heç vaxt boş blok görmür.
5. **Statik generasiya:** server və DB tələb olunmur, istənilən statik hostinqə yerləşdirilə bilər.
6. **Saf ML məntiqi** (`lib/ml/`) UI-dan ayrıdır və testlərlə yoxlanılır. Simulyasiyalar deterministikdir (seed), hamı eyni şəkli görür.
7. **Proqres** repository interfeysi arxasındadır. Server sinxronizasiyası üçün yalnız adapter yazmaq lazımdır.

## Yeni fəsil necə əlavə olunur

Misal: Fəsil 2.

1. Qovluq yaradın: `src/content/chapters/02-end-to-end-project/`. Struktur Chapter 1 ilə eynidir:
   ```
   chapter.ts  index.ts  quizzes.ts  exercises.ts  assets.ts  lessons/  code/
   ```
2. `chapter.ts`-də `ChapterInput` obyektini yazın. `id: "ch02"`, `slug` və `number` `planned.ts`-dəki ilə eyni olmalıdır. Sonra `status: "published"` (və ya hazırlıq zamanı `"draft"`) qoyun.
3. `index.ts`-də `ChapterModule` export edin (Chapter 1-in `index.ts`-inə baxın).
4. `src/content/registry.ts`-də `authoredChapters` siyahısına əlavə edin:
   ```ts
   const authoredChapters: ChapterModule[] = [chapter01Module, chapter02Module];
   ```
   `planned.ts`-dəki eyni ID-li yer tutucu **avtomatik** çıxarılır.
5. `lessons/index.ts` yaradın və `src/content/lesson-loaders.ts`-ə əlavə edin:
   ```ts
   export const lessonLoaders = { ...chapter01LessonLoaders, ...chapter02LessonLoaders };
   ```
6. `npm test && npm run build` işlədin. Validator hər hansı uyğunsuzluğu göstərəcək.

## Yeni dərs necə əlavə olunur

1. Fəslin `chapter.ts` faylında `lessons` massivinə obyekt əlavə edin:
   ```ts
   {
     id: "ch01.new-topic",            // fəsil prefiksi məcburidir, dəyişməz ID
     slug: "new-topic",               // URL: /chapters/<fəsil>/new-topic
     title: "Yeni mövzu",
     description: "Qısa təsvir…",
     type: "theory",                  // theory | visual-simulation | code-lab | math | assessment
     estimatedDuration: 20,
     difficulty: "beginner",
     status: "draft",                 // hazır olanda "published"
     learningObjectives: [{ id: "ch01.new-topic.obj1", text: "…", level: "understand" }],
     prerequisites: [{ kind: "lesson", lessonId: "ch01.what-is-ml" }],
     sections: [
       { id: "intro", title: "Giriş", kind: "concept" },
       { id: "summary", title: "Xülasə", kind: "summary" },
     ],
     keyConcepts: ["machine-learning"],   // glossary ID-ləri
     quizId: "ch01.quiz.new-topic",       // ixtiyari
     exerciseIds: [],                     // ixtiyari
   }
   ```
2. `lessons/new-topic.mdx` yaradın. Hər bölmə metadata-dakı **eyni sıra ilə** `<Section>` ilə yazılır:
   ```mdx
   <Section id="intro">

   <Term id="machine-learning" full /> haqqında mətn… Düstur: $\hat{y} = \theta_0 + \theta_1 x$

   <Callout variant="tip">Məsləhət mətni.</Callout>

   </Section>

   <Section id="summary">

   - Əsas nəticələr…

   </Section>
   ```
   Bölmə başlıqlarını `##` ilə yazmayın, onları `<Section>` metadata-dan özü qurur. Alt başlıq üçün `###` istifadə edin.
3. `lessons/index.ts`-ə loader əlavə edin: `"ch01.new-topic": () => import("./new-topic.mdx")`.
4. Quiz və ya tapşırıq varsa, `quizzes.ts` / `exercises.ts`-ə əlavə edin (`lessonId` ilə).
5. `npm test`. Test MDX bölmələrinin metadata ilə uyğunluğunu və bütün istinadları yoxlayır.

MDX-də mövcud komponentlər: `Section`, `Term`, `Callout` (`info | tip | warning | insight`), `Demo`, `PythonExample`, `Media`, `Dataset`, fenced kod blokları (avtomatik rənglənir), GFM cədvəlləri, `$…$` və `$$…$$` düsturları.

> MDX qeydi: mətndə `{`, `}` və `<` simvolları JSX kimi oxunur. Onları düstur (`$…$`) və ya kod (`` `…` ``) içində yazın. KaTeX şriftlərində `ə` hərfi olmadığı üçün düstur daxilində Azərbaycan sözlərindən qaçın və izahı mətndə verin.

## Yeni interaktiv demo necə əlavə olunur

1. **Məntiq** (tövsiyə olunur): alqoritmi saf funksiya kimi `src/lib/ml/` qovluğuna yazın və test əlavə edin.
2. **Komponent:** `src/components/demos/my-demo.tsx` yaradın (`"use client"`, `export default`). Mövcud hissələrdən istifadə edin: `Plot`, `Marker`, `linePath` (`plot.tsx`), `DemoLayout`, `Stat`, `LiveRegion`, `Legend` (`demo-ui.tsx`), `SliderField`, `SegmentedControl`. Məlumat üçün `createRng(seed)` istifadə edin, `Math.random` yox (SSR/hydration uyğunluğu üçün).
3. **Registry:** `src/components/demos/registry.tsx`:
   ```ts
   "my-demo": dynamic(() => import("./my-demo"), { loading: DemoLoading }),
   ```
4. **Metadata:** `src/content/demos.ts`-ə `{ id: "my-demo", title, description, kind, chapterId, lessonIds, concepts, estimatedDuration, status, instructions }` əlavə edin.
5. **İstifadə:** dərs MDX-ində `<Demo id="my-demo" />` yazın və dərsin `interactiveDemoReferences` siyahısına əlavə edin. Demo `/playground/my-demo` ünvanında da avtomatik görünəcək.

Test registry ilə metadata-nın sinxron olduğunu yoxlayır.

## Yeni məlumat dəsti necə əlavə olunur

1. CSV faylını `public/data/` qovluğuna qoyun. Mümkünsə onu yaradan və ya yükləyən skripti `scripts/`-ə əlavə edin.
2. `src/content/datasets.ts`-də qeyd edin: `id`, `title`, `description`, `file` (`/data/...csv`), `rows`, `columns` (ad, tip, təsvir, vahid), `license`, `provenance`, `chapterIds`.
3. MDX-də `<Dataset id="..." />` yazın. Kart sütun lüğətini və yükləmə düyməsini göstərir. Python Lab səhifəsində də avtomatik görünür.
4. Brauzer demosunda `DatasetGate` komponenti (`src/components/demos/dataset-gate.tsx`) bir və ya bir neçə CSV-ni loading, error və retry halları ilə yükləyir. `parse` funksiyasını modul səviyyəsində təyin edin. Hazır gate-lər: `ApartmentsGate`, `DigitsGate`.
5. `npm test` CSV başlığının `columns` ilə, sətir sayının isə `rows` ilə üst-üstə düşdüyünü yoxlayır.

## Yeni media faylı necə əlavə olunur

1. Faylı `public/media/<fəsil>/` qovluğuna qoyun, məsələn `public/media/ch02/pipeline.svg`. Xarici fayllar üçün `https://` URL istifadə edin.
2. Fəslin `assets.ts` faylındakı media siyahısına əlavə edin:
   ```ts
   // şəkil
   { id: "ch02.media.pipeline", type: "image", title: "…", src: "/media/ch02/pipeline.svg",
     alt: "Ekran oxuyucu üçün ətraflı təsvir", width: 960, height: 400,
     caption: "…", credit: "…", license: "CC BY 4.0", chapterId: "ch02" }
   // video
   { id: "ch02.media.intro", type: "video", title: "…", src: "/media/ch02/intro.mp4",
     poster: "/media/ch02/intro.jpg", captions: [{ src: "/media/ch02/intro.az.vtt", srclang: "az", label: "Azərbaycanca" }] }
   // embed
   { id: "ch02.media.talk", type: "embed", title: "…", provider: "youtube", videoId: "XXXXXXXXXXX" }
   ```
3. MDX-də `<Media id="ch02.media.pipeline" />` yazın və dərsin `mediaReferences` siyahısına əlavə edin.
4. `npm test` lokal faylın mövcudluğunu yoxlayır.

## Layihə strukturu

Ətraflı qovluq ağacı və data modeli: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Müəllif hüquqları

Kitabdan mətn, şəkil və ya tapşırıq köçürülməyib. Kitab yalnız mövzu ardıcıllığı və terminologiya üçün istinad kimi istifadə olunub. Platformada mənbə göstərilir: *Hands-On Machine Learning with Scikit-Learn and PyTorch*, Aurélien Géron, O'Reilly Media.
