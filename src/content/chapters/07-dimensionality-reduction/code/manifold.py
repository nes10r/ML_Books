"""Manifold öyrənmə: LLE, Isomap və t-SNE."""
import numpy as np
from sklearn.datasets import load_digits, make_swiss_roll
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE, Isomap, LocallyLinearEmbedding, trustworthiness

X_roll, t = make_swiss_roll(n_samples=1000, noise=0.2, random_state=42)
for name, model in [
    ("PCA", PCA(n_components=2)),
    ("LLE", LocallyLinearEmbedding(n_components=2, n_neighbors=10, random_state=42)),
    ("Isomap", Isomap(n_components=2, n_neighbors=10)),
]:
    X2 = model.fit_transform(X_roll)
    # açılmış koordinatlardan biri rulonun "uzunluğu" (t) ilə nə qədər əlaqəlidir?
    corr = max(abs(np.corrcoef(X2[:, k], t)[0, 1]) for k in range(2))
    print(f"İsveçrə rulonu, {name:<6}: t ilə ən güclü korrelyasiya = {corr:.3f}")

X, y = load_digits(return_X_y=True)
X, y = X[:800], y[:800]
for name, model in [("PCA", PCA(n_components=2)), ("t-SNE", TSNE(n_components=2, init="pca", random_state=42))]:
    X2 = model.fit_transform(X)
    print(f"Rəqəmlər, {name:<6}: trustworthiness = {trustworthiness(X, X2, n_neighbors=10):.3f}")
