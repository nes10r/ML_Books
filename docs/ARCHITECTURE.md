# Arxitektura sənədi

Bu sənəd platformanın memarlıq qərarlarını, data modelini və gələcək genişlənmə nöqtələrini izah edir.

## 1. Əsas prinsiplər

| Prinsip | Necə tətbiq olunur |
|---|---|
| **Content-driven** | Bütün məzmun `src/content/` qovluğunda, tipli TS faylları və MDX şəklində saxlanılır. Komponentlərin içində kurs məzmunu yoxdur. |
| **Tək qeydiyyat nöqtəsi** | Yeni fəsil `src/content/registry.ts` faylına bir sətirlə qoşulur. Routing, naviqasiya, kurikulum, axtarış və validasiya onu avtomatik görür. |
| **Fail loudly** | Zod sxemləri və çarpaz istinad validatoru build zamanı işləyir. Səhv ID build-i sındırır, boş səhifə göstərmir. |
| **Repository qatı** | Səhifələr məzmunu yalnız `lib/content/repository.ts` vasitəsilə oxuyur. Gələcəkdə CMS və ya DB-yə keçid tək faylda baş verir. |
| **Statik (SSG)** | Bütün səhifələr build zamanı yaradılır (`generateStaticParams` + `dynamicParams = false`). Server tələb olunmur. |
| **Saf ML məntiqi** | Demoların riyaziyyatı (`lib/ml/`) React-dan asılı deyil və unit testlərlə yoxlanılır. |
| **Lazy demolar** | Hər simulyasiya ayrıca chunk-dır (`next/dynamic`). Dərs yalnız istifadə etdiyi demonu yükləyir. |

## 2. Qovluq strukturu

```
ml-platform/
├── docs/ARCHITECTURE.md
├── public/media/ch0N/            # Orijinal SVG diaqramlar (MediaAsset faylları)
├── public/data/                  # Məlumat dəstləri (Dataset faylları, CSV)
├── scripts/                      # Məlumat dəsti generatorları
├── src/
│   ├── app/                      # Next.js App Router — yalnız routing və səhifə kompozisiyası
│   │   ├── page.tsx              # Ana səhifə
│   │   ├── curriculum/           # Kurikulum
│   │   ├── chapters/[chapterSlug]/[lessonSlug]/
│   │   ├── playground/[demoId]/  # İnteraktiv ML Playground
│   │   ├── lab/                  # Python Lab
│   │   ├── exercises/[quizId]/   # Testlər və tapşırıqlar
│   │   ├── glossary/  resources/  progress/
│   │   └── layout.tsx, error.tsx, not-found.tsx, loading.tsx
│   ├── content/                  # ← MƏZMUN (müəllim burada işləyir)
│   │   ├── registry.ts           # Bütün məzmunun qeydiyyat nöqtəsi
│   │   ├── lesson-loaders.ts     # Dərs ID → MDX
│   │   ├── course.ts  demos.ts  datasets.ts  glossary.ts  resources.ts
│   │   └── chapters/
│   │       ├── planned.ts        # Hələ yazılmamış fəsillərin (2–19) metadata-sı
│   │       └── 01-machine-learning-landscape/
│   │           ├── chapter.ts    # Fəsil + dərs metadata-sı
│   │           ├── lessons/*.mdx # Dərs mətnləri
│   │           ├── code/*.py     # İşlək Python nümunələri
│   │           ├── quizzes.ts  exercises.ts  assets.ts (kod + media)
│   │           └── index.ts      # ChapterModule
│   ├── components/
│   │   ├── ui/                   # shadcn tipli primitivlər (Button, Card, Sheet…)
│   │   ├── layout/               # Header, footer, tema, proqres provider
│   │   ├── course/               # Kartlar, badge-lər, sol naviqasiya
│   │   ├── lesson/               # CourseShell (3 sütunlu layout), TOC, bölmələr
│   │   ├── mdx/                  # MDX komponentləri (Section, Term, Callout…)
│   │   ├── demos/                # Plot primitivləri, demo registry, simulyasiyalar
│   │   ├── media/  code/  quiz/  exercises/  glossary/  progress/  home/
│   └── lib/
│       ├── schemas/              # Zod sxemləri = data modelinin mənbəyi
│       ├── content/              # parse → validate → repository
│       ├── progress/             # Reducers, repository interfeysi, Zustand store
│       ├── ml/                   # Saf ML alqoritmləri (regressiya, k-NN, k-means, statistika, bölgü, CV…)
│       ├── data/                 # CSV parser, dataset hook (loading/error/retry), tipləşdirmə
│       ├── highlight/            # Shiki (build zamanı)
│       └── i18n/az.ts            # Bütün UI mətnləri
└── tests/                        # Məzmun bütövlüyü və validator testləri
```

## 3. Data modeli

Bütün tiplər Zod sxemlərindən çıxarılır (`z.infer`). Tək mənbə `src/lib/schemas/`-dir.

```
Course ─┬─ Part[] ─── Chapter[] ─── Lesson[] ─── LessonSection[]
        │                │              │
        │                │              ├── keyConcepts      → GlossaryTerm.id
        │                │              ├── codeExampleIds   → CodeExample.id
        │                │              ├── quizId           → Quiz.id
        │                │              ├── exerciseIds      → Exercise.id
        │                │              └── resourceIds      → Resource.id
        │                └── ContentMeta (chapter və lesson üçün ortaq)
        │                     title, description, estimatedDuration, difficulty, status,
        │                     prerequisites, learningObjectives, tags,
        │                     mediaReferences → MediaAsset.id,
        │                     interactiveDemoReferences → InteractiveDemo.id,
        │                     githubReferences
        └── LearningProgress (brauzer, ID-lərlə)
```

| Varlıq | Açar sahələr | Qeyd |
|---|---|---|
| `Course` | `parts`, `locale`, `source` | Kitab istinadı `source`-da saxlanılır |
| `Chapter` | `id` (`ch01`), `slug`, `number`, `partId`, `bookReference`, `lessons`, `quizIds` | `status: planned` olan fəslin dərsi ola bilməz |
| `Lesson` | `id` (`ch01.what-is-ml`), `slug`, `type`, `sections` | ID fəsil prefiksi ilə başlamalıdır |
| `LessonSection` | `id`, `title`, `kind` | Mətni MDX-də `<Section id>` ilə yazılır |
| `ContentBlock` | `demo / code / media / term / callout` | MDX-ə yerləşdirilən blokların props sxemi |
| `InteractiveDemo` | `id` = client registry açarı | Metadata server tərəfdə, komponent client tərəfdə |
| `CodeExample` | `file`, `libraries`, `runtime`, `expectedOutput` | Fayl diskdən build zamanı oxunur |
| `Quiz` / `Question` | `single-choice`, `multiple-choice`, `true-false` | Düzgün cavabın variantlarda olması sxemdə yoxlanılır |
| `Exercise` | `kind`, `hints`, `solution` | Həll `<details>` arxasında gizlədilir |
| `MediaAsset` | `image / video / embed` (discriminated union) | Yeni tip = sxemə bir variant + `MediaBody`-yə bir case |
| `GlossaryTerm` | `az`, `en`, `related`, `aliases` | İkidilli göstəriş `<Term id full />` ilə |
| `Dataset` | `file`, `rows`, `columns[]` (ad, tip, vahid), `license`, `provenance` | Kurs səviyyəsində (fəsillər arasında paylaşılır). Demolar brauzerdə `fetch` edir, Python skriptləri isə eyni faylı oxuyur. |
| `LearningObjective` | `id`, `text`, `level` (Bloom) | Gələcək analitika üçün səviyyə |
| `Prerequisite` | `lesson / chapter / skill` | Linklər avtomatik qurulur |
| `LearningProgress` | `version`, `lessons`, `quizzes`, `updatedAt` | Versiyalı, serverə sinxronlaşdırılmağa hazır forma |

**Stabil identifikatorlar:** `id` heç vaxt dəyişmir, çünki proqres, quiz nəticələri və gələcək analitika ona bağlıdır. `slug` URL üçündür. Dərc olunduqdan sonra slug da dəyişməməlidir. Dəyişmək lazım gəlsə, redirect əlavə edin.

**Statuslar:** `published` (görünür), `draft` (yalnız `next dev`-də görünür), `planned` (struktur yer tutucu: başlıq və təsvir göstərilir, məzmun “hazırlanır” kimi aydın işarələnir).

## 4. Dərs bloklarının modeli

Dərs blokları iki mənbədən gəlir:

1. **Generated** (data-dan): `objectives`, `prerequisites`, `knowledge-check`, `practice`, `next`. Lesson səhifəsi bunları metadata-dan avtomatik qurur.
2. **MDX** (`<Section id>`): `concept`, `step-by-step`, `visualization`, `math`, `worked-example`, `python`, `case-study`, `common-mistakes`, `summary`.

Heç bir blok məcburi deyil. `buildToc()` funksiyası “Bu səhifədə” siyahısını həmin iki mənbədən qurur. Test MDX-dəki `<Section>` ID-lərinin metadata ilə **eyni sırada** üst-üstə düşdüyünü yoxlayır.

## 5. Proqres

```
UI ──► useProgressStore (Zustand) ──► reducers (saf funksiyalar) ──► ProgressRepository
                                                                     └─ LocalStorageProgressRepository (v1)
```

- **Hydration:** SSR zamanı proqres boşdur (`hydrated: false`) və UI neytral vəziyyət göstərir. Mount-dan sonra storage oxunur. Beləliklə hydration mismatch yaranmır.
- **Zədələnmiş məlumat:** Zod ilə yoxlanılır. Uyğun gəlməyən məlumat atılır, xəta atılmır.
- **Tablar arası sinxronizasiya:** `storage` hadisəsi ilə.

## 6. Gələcək genişlənmə nöqtələri

Aşağıdakılar **implementasiya edilməyib**. Burada hər birinin harada və necə qoşulacağı göstərilir.

| Funksiya | Genişlənmə nöqtəsi |
|---|---|
| **Tələbə / müəllim autentifikasiyası** | Auth.js (NextAuth) və ya Clerk. `app/(auth)/` route qrupu, `middleware` əvəzinə Next 16 `proxy.ts`. Rol modeli: `student`, `instructor`, `admin`. |
| **Proqres sinxronizasiyası** | `RemoteProgressRepository implements ProgressRepository` (REST/Server Actions). `store.ts`-də repository dəyişdirilir. İlk girişdə local → remote birləşdirmə (`updatedAt` əsasında). |
| **Tapşırıqlar və müəllim rəyi** | Yeni sxemlər: `Assignment { id, exerciseIds, dueAt, cohortId }`, `Submission`, `Feedback`. `Exercise` artıq stabil ID-yə malikdir. |
| **Müəllim paneli** | `app/instructor/` (rol ilə qorunur): qrup proqresi, quiz analitikası. Məlumat `LearningProgress` formasında toplanır. |
| **Video dərslər** | `MediaAsset` artıq `video` (altyazılarla) və `embed` (YouTube/Vimeo) dəstəkləyir. Self-hosted HLS üçün sxemə `type: "stream"` əlavə edilir. |
| **Quiz analitikası** | `QuizProgress`-ə hər cəhd üçün `answers[]` əlavə edilir (versiya 2 + migrasiya). Sual ID-ləri artıq stabildir. |
| **Sertifikatlar** | Fəsil üzrə şərt: bütün dərslər tamamlanıb + `quizIds` keçid balından yuxarıdır. Server tərəfdə imzalanmış PDF. |
| **Özəl qeydiyyat / ödənişli giriş** | Chapter/Lesson sxeminə `access: "public" | "enrolled" | "paid"`. Yoxlama repository və `proxy.ts` qatında. Stripe webhook → enrollment cədvəli. |
| **AI müəllim köməkçisi** | Dərs səhifəsinin sağ panelinə yeni widget. Kontekst dərs metadata-sı, MDX mətni və glossary-dən götürülür. API route server tərəfdə işləyir. |
| **Jupyter notebook inteqrasiyası** | `CodeExample`-a `notebook?: string` (`.ipynb` yolu) və GitHub/Colab linki (`githubReferences` artıq var). |
| **Python icra xidməti** | `CodeExample.runtime` enum-u `"pyodide"` (brauzer) və ya `"remote"` (sandbox servis) ilə genişlənir. Lab komponentinə “İşlət” düyməsi yalnız runtime dəstəklədikdə əlavə edilir. |
| **Çoxdillilik** | UI: `lib/i18n/az.ts` ilə eyni formada `en.ts`, `ru.ts`. Route: `app/[locale]/`. Məzmun: `content/<locale>/chapters/...` və ya `LocalizedString` sahələri. `courseSchema.locale` enum-u genişlənir. |
| **CMS** | `parseContent(raw)` istənilən mənbədən gələn xam obyekti qəbul edir. CMS adapteri `RawContent` qaytarmalıdır. |

## 7. Texnoloji qərarlar

- **Next.js 16 (App Router, Turbopack), React 19, TypeScript strict** (`noUncheckedIndexedAccess` ilə).
- **@next/mdx** + `remark-math`/`rehype-katex` (düsturlar build zamanı HTML-ə çevrilir, client JS tələb etmir), `remark-gfm` (cədvəllər), `rehype-slug`. Plugin-lər string adları ilə verilir (Turbopack tələbi).
- **Shiki** — sintaksis rəngləmə build zamanı, işıqlı/qaranlıq tema CSS dəyişənləri ilə.
- **Vizualizasiya — xüsusi SVG primitivləri** (`components/demos/plot.tsx`). Recharts/Plotly əvəzinə seçildi, çünki demolar klikləmə, alqoritm addımları və qərar bölgələri kimi dəqiq qarşılıqlı əlaqə tələb edir. SVG ~200 sətirdir, əlavə asılılıq yoxdur, `role="img"`, `aria-label` və formalı markerlər (rəng korluğu üçün) ilə əlçatandır. Statistik dashboard lazım olsa, Recharts əlavə etmək asandır.
- **Motion** — yalnız mənalı animasiya (onlayn öyrənmədə gələn nümunə). `prefers-reduced-motion` nəzərə alınır.
- **Zustand** — yalnız paylaşılan proqres vəziyyəti üçün. Demoların lokal vəziyyəti `useState`-də qalır.
- **shadcn/ui yanaşması** — Radix primitivləri + `cva`, kod layihənin içindədir. `components.json` saxlanılıb, `npx shadcn add …` işləyir.
- **next-themes** — default işıqlı tema, qaranlıq tema dəstəyi. Rənglər semantik CSS tokenləridir (`globals.css`).
