"""Qauss qarışıq modelləri: EM, anomaliya aşkarlanması, BIC/AIC və Bayes GMM."""
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.mixture import BayesianGaussianMixture, GaussianMixture

rng = np.random.default_rng(seed=5)
X = np.vstack([
    rng.multivariate_normal([0, 0], [[2.0, 1.4], [1.4, 1.2]], 400),     # uzunsov, maili
    rng.multivariate_normal([5, 3], [[0.4, 0.0], [0.0, 0.4]], 250),
    rng.multivariate_normal([3, -2.5], [[1.0, -0.6], [-0.6, 0.6]], 250),
])

gm = GaussianMixture(n_components=3, n_init=10, random_state=42).fit(X)
order = np.argsort(gm.means_[:, 0])
print("Çəkilər:", gm.weights_[order].round(3))
print("Ortalar:\n", gm.means_[order].round(2))
print(f"EM yığıldı? {gm.converged_}, iterasiya = {gm.n_iter_}")

densities = gm.score_samples(X)                      # log ehtimal sıxlığı
threshold = np.percentile(densities, 2)              # ən aşağı sıxlıqlı 2% = anomaliya
anomalies = X[densities < threshold]
print(f"Anomaliya həddi (log sıxlıq) = {threshold:.2f}, anomaliya sayı = {len(anomalies)}")

print(f"\n{'k':>2} | {'BIC':>8} | {'AIC':>8}")
for k in range(1, 7):
    g = GaussianMixture(n_components=k, n_init=5, random_state=42).fit(X)
    print(f"{k:>2} | {g.bic(X):>8.1f} | {g.aic(X):>8.1f}")

bgm = BayesianGaussianMixture(n_components=8, n_init=5, max_iter=500, random_state=42).fit(X)
print("\nBayes GMM (8 komponentlə başladı), çəkilər:", np.sort(bgm.weights_)[::-1].round(3))

iso = IsolationForest(contamination=0.02, random_state=42).fit(X)
overlap = np.mean(np.isin(np.where(iso.predict(X) == -1)[0], np.where(densities < threshold)[0]))
print(f"IsolationForest anomaliyalarının GMM ilə üst-üstə düşmə payı: {overlap:.0%}")
