"""k-means: təlim, inertia, mərkəzlərin inisializasiyası və mini-paket variantı."""
import numpy as np
from sklearn.cluster import KMeans, MiniBatchKMeans
from sklearn.datasets import make_blobs

centers = np.array([[-3, 2.5], [-1.5, -1.5], [0.5, 2.8], [2.8, 0.5], [3.5, 3.5]])
X, y_true = make_blobs(n_samples=1000, centers=centers, cluster_std=[0.7, 0.5, 0.6, 0.45, 0.35], random_state=7)

km = KMeans(n_clusters=5, random_state=42).fit(X)
print("Tapılan mərkəzlər:\n", np.round(km.cluster_centers_[np.argsort(km.cluster_centers_[:, 0])], 2))
print(f"Inertia = {km.inertia_:.1f}, iterasiya sayı = {km.n_iter_}")
X_new = np.array([[0, 2], [3, 2], [-3, 3]])
print("Yeni nöqtələrin klasterləri:", km.predict(X_new), "| mərkəzlərə məsafələr:\n", km.transform(X_new).round(2))

# Tək təsadüfi inisializasiya pis yerli minimuma düşə bilər
inertias = [KMeans(n_clusters=5, init="random", n_init=1, random_state=s).fit(X).inertia_ for s in range(20)]
print(f"\n20 tək təsadüfi başlanğıc: ən yaxşı inertia = {min(inertias):.1f}, ən pis = {max(inertias):.1f}, "
      f"pis nəticələrin sayı = {sum(i > min(inertias) * 1.05 for i in inertias)}")
kpp = [KMeans(n_clusters=5, init="k-means++", n_init=1, random_state=s).fit(X).inertia_ for s in range(20)]
print(f"20 tək k-means++ başlanğıc: ən pis = {max(kpp):.1f}, pis nəticələrin sayı = {sum(i > min(inertias) * 1.05 for i in kpp)}")

mb = MiniBatchKMeans(n_clusters=5, batch_size=100, random_state=42, n_init=3).fit(X)
print(f"MiniBatchKMeans inertia = {mb.inertia_:.1f} (adi k-means: {km.inertia_:.1f})")
