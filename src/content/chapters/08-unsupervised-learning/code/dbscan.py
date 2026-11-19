"""DBSCAN: sıxlığa əsaslanan klasterləşdirmə və k-means ilə müqayisə."""
import numpy as np
from sklearn.cluster import DBSCAN, KMeans
from sklearn.datasets import make_moons
from sklearn.metrics import adjusted_rand_score
from sklearn.neighbors import KNeighborsClassifier

X, y = make_moons(n_samples=1000, noise=0.06, random_state=42)
for eps in (0.05, 0.2):
    db = DBSCAN(eps=eps, min_samples=5).fit(X)
    labels = db.labels_
    n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
    print(f"eps = {eps}: klaster = {n_clusters}, küy nöqtəsi = {(labels == -1).sum()}, "
          f"əsas nöqtə = {len(db.core_sample_indices_)}, ARI = {adjusted_rand_score(y, labels):.3f}")

km = KMeans(n_clusters=2, random_state=42).fit(X)
print(f"k-means (k = 2): ARI = {adjusted_rand_score(y, km.labels_):.3f}")

# DBSCAN-ın predict() metodu yoxdur — əsas nöqtələr üzərində təsnifatçı öyrədirik
db = DBSCAN(eps=0.2, min_samples=5).fit(X)
knn = KNeighborsClassifier(n_neighbors=50).fit(db.components_, db.labels_[db.core_sample_indices_])
X_new = np.array([[-0.5, 0], [0, 0.5], [1, -0.1], [2, 1]])
dist, _ = knn.kneighbors(X_new, n_neighbors=1)
pred = knn.predict(X_new)
pred[dist.ravel() > 0.2] = -1                                # əsas nöqtələrdən uzaqdırsa: anomaliya
print("Yeni nöqtələr:", pred)
