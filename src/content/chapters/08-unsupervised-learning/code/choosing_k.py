"""k-nın seçimi: inertia (“dirsək”) və silhouette balı."""
import numpy as np
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
from sklearn.metrics import silhouette_score

centers = np.array([[-3, 2.5], [-1.5, -1.5], [0.5, 2.8], [2.8, 0.5], [3.5, 3.5]])
X, _ = make_blobs(n_samples=1000, centers=centers, cluster_std=[0.7, 0.5, 0.6, 0.45, 0.35], random_state=7)

print(f"{'k':>2} | {'inertia':>8} | {'silhouette':>10}")
best = None
for k in range(2, 9):
    km = KMeans(n_clusters=k, random_state=42).fit(X)
    sil = silhouette_score(X, km.labels_)
    best = max(best or (sil, k), (sil, k))
    print(f"{k:>2} | {km.inertia_:>8.1f} | {sil:>10.3f}")
print(f"Ən yüksək silhouette: k = {best[1]}")
