"""k-means-in tətbiqləri: rəng seqmentasiyası və yarı-nəzarətli öyrənmə."""
import numpy as np
from sklearn.cluster import KMeans
from sklearn.datasets import load_digits
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

# 1) Proqramla çəkilmiş "dəniz mənzərəsi" (göy, günəş, dəniz, qum) — 120×160 RGB
h, w = 120, 160
yy, xx = np.mgrid[0:h, 0:w]
img = np.zeros((h, w, 3))
sky = yy < 60
img[sky] = np.c_[0.35 + 0.004 * yy[sky], 0.55 + 0.003 * yy[sky], 0.95 - 0.002 * yy[sky]]
img[~sky & (yy < 95)] = [0.05, 0.3, 0.55]
img[yy >= 95] = [0.85, 0.75, 0.5]
sun = (yy - 25) ** 2 + (xx - 120) ** 2 < 15**2
img[sun] = [1.0, 0.85, 0.2]
img = np.clip(img + np.random.default_rng(0).normal(0, 0.03, img.shape), 0, 1)
pixels = img.reshape(-1, 3)
for k in (2, 4, 8):
    km = KMeans(n_clusters=k, n_init=3, random_state=42).fit(pixels)
    segmented = km.cluster_centers_[km.labels_]
    print(f"{k} rəng: orta rəng xətası = {np.abs(pixels - segmented).mean():.3f}, "
          f"günəş ayrı seqmentdir? {len(set(km.labels_[sun.ravel()])) == 1 and km.labels_[sun.ravel()][0] not in set(km.labels_[~sun.ravel()])}")

# 2) Yarı-nəzarətli öyrənmə: yalnız 50 şəkil etiketlənə bilər
X, y = load_digits(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
k = 50
rng = np.random.default_rng(42)
rand_idx = rng.choice(len(X_train), k, replace=False)
lr = LogisticRegression(max_iter=10_000).fit(X_train[rand_idx], y_train[rand_idx])
print(f"\n50 təsadüfi etiketli şəkil:            test = {lr.score(X_test, y_test):.3f}")

km = KMeans(n_clusters=k, n_init=10, random_state=42).fit(X_train)
rep_idx = np.argmin(km.transform(X_train), axis=0)        # hər klasterin mərkəzə ən yaxın şəkli
lr = LogisticRegression(max_iter=10_000).fit(X_train[rep_idx], y_train[rep_idx])
print(f"50 nümayəndə şəkil (klaster mərkəzləri): test = {lr.score(X_test, y_test):.3f}")

y_prop = y_train[rep_idx][km.labels_]                       # etiketi bütün klasterə yay
lr = LogisticRegression(max_iter=10_000).fit(X_train, y_prop)
print(f"Etiketlərin klasterə yayılması (1437):   test = {lr.score(X_test, y_test):.3f}, "
      f"yayılmış etiketlərin dəqiqliyi = {(y_prop == y_train).mean():.3f}")
