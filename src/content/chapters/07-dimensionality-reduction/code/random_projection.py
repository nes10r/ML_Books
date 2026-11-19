"""Təsadüfi proyeksiya və Conson–Lindenştraus lemması."""
import numpy as np
from sklearn.random_projection import GaussianRandomProjection, SparseRandomProjection, johnson_lindenstrauss_min_dim

m, n = 2_000, 10_000
for eps in (0.1, 0.2, 0.3):
    d = johnson_lindenstrauss_min_dim(n_samples=m, eps=eps)
    print(f"ε = {eps}: məsafələri ±{eps:.0%} daxilində saxlamaq üçün kifayətdir d = {d}")

rng = np.random.default_rng(seed=42)
X = rng.standard_normal((m, n))
d = johnson_lindenstrauss_min_dim(n_samples=m, eps=0.2)
for name, proj in [("Gaussian", GaussianRandomProjection(n_components=d, random_state=42)),
                   ("Sparse", SparseRandomProjection(n_components=d, random_state=42))]:
    X_low = proj.fit_transform(X)
    i, j = rng.integers(0, m, 500), rng.integers(0, m, 500)
    keep = i != j
    ratio = np.linalg.norm(X_low[i[keep]] - X_low[j[keep]], axis=1) / np.linalg.norm(X[i[keep]] - X[j[keep]], axis=1)
    print(f"{name:<8} {n} → {d} ölçü: məsafə nisbəti min = {ratio.min():.3f}, max = {ratio.max():.3f}")
