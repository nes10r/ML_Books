"""PCA-nın əsasları: SVD ilə əsas komponentlər və izah olunan dispersiya."""
import numpy as np
from sklearn.decomposition import PCA

rng = np.random.default_rng(seed=3)
# 3D məlumat, demək olar ki, maili bir müstəvi üzərində yerləşir
m = 200
t1, t2 = rng.normal(0, 3, m), rng.normal(0, 1, m)
X = np.c_[t1 + 0.5 * t2, 0.8 * t1 - t2, 0.3 * t1 + 0.2 * t2 + rng.normal(0, 0.2, m)]

# 1) SVD ilə əl ilə
X_centered = X - X.mean(axis=0)              # PCA mərkəzləşdirilmiş məlumat tələb edir
U, s, Vt = np.linalg.svd(X_centered, full_matrices=False)
c1, c2 = Vt[0], Vt[1]
print("Birinci əsas komponent (vahid vektor):", c1.round(3))
X2D_manual = X_centered @ Vt[:2].T           # d = 2 ölçüyə proyeksiya

# 2) Scikit-Learn ilə
pca = PCA(n_components=2)
X2D = pca.fit_transform(X)
print("Scikit-Learn komponentləri:\n", pca.components_.round(3))
print("Əl ilə və Scikit-Learn proyeksiyaları eynidirmi (işarəyə qədər)?",
      np.allclose(np.abs(X2D), np.abs(X2D_manual)))
print("İzah olunan dispersiya payı:", pca.explained_variance_ratio_.round(4))
print(f"İtirilən dispersiya: {1 - pca.explained_variance_ratio_.sum():.2%}")
