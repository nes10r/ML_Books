"""PCA praktikada: ölçü sayının seçilməsi, sıxılma, randomized və incremental PCA."""
import numpy as np
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA, IncrementalPCA
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_digits(return_X_y=True)
pca_full = PCA().fit(X)
cumsum = np.cumsum(pca_full.explained_variance_ratio_)
for target in (0.80, 0.90, 0.95, 0.99):
    print(f"Dispersiyanın {target:.0%}-ni saxlamaq üçün: {np.argmax(cumsum >= target) + 1} ölçü (64-dən)")

pca = PCA(n_components=0.95)                 # 0–1 arası qiymət = saxlanılacaq dispersiya payı
X_reduced = pca.fit_transform(X)
X_recovered = pca.inverse_transform(X_reduced)
print(f"\nSıxılma: {X.shape[1]} → {pca.n_components_} ölçü "
      f"(ölçünün {pca.n_components_ / X.shape[1]:.0%}-i), orta bərpa xətası = {np.mean((X - X_recovered) ** 2):.2f}")

rnd = PCA(n_components=pca.n_components_, svd_solver="randomized", random_state=42).fit(X)
inc = IncrementalPCA(n_components=pca.n_components_)
for batch in np.array_split(X, 10):          # məlumat hissə-hissə gəlir (məs. diskdən)
    inc.partial_fit(batch)
print("Randomized PCA ilə izah olunan dispersiya:", rnd.explained_variance_ratio_.sum().round(4))
print("Incremental PCA ilə izah olunan dispersiya:", inc.explained_variance_ratio_.sum().round(4))

for name, model in [
    ("64 piksel", make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000))),
    ("PCA (95%)", make_pipeline(StandardScaler(), PCA(n_components=0.95), LogisticRegression(max_iter=2000))),
]:
    print(f"{name:<10} CV dəqiqliyi = {cross_val_score(model, X, y, cv=5).mean():.3f}")
