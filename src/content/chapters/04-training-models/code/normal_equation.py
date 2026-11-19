"""Normal tənlik, psevdo-tərs matris və Scikit-Learn-in LinearRegression sinfi."""
import time

import numpy as np
from sklearn.linear_model import LinearRegression

rng = np.random.default_rng(seed=7)
m = 100
X = 3 * rng.random((m, 1))
y = 3 + 1.8 * X[:, 0] + rng.normal(0, 0.5, m)
X_b = np.c_[np.ones((m, 1)), X]

theta_normal = np.linalg.inv(X_b.T @ X_b) @ X_b.T @ y   # θ = (XᵀX)⁻¹ Xᵀ y
theta_pinv = np.linalg.pinv(X_b) @ y                    # SVD əsaslı psevdo-tərs: daha dayanıqlı
theta_lstsq, *_ = np.linalg.lstsq(X_b, y, rcond=None)
print("Normal tənlik:", theta_normal.round(4))
print("pinv:         ", theta_pinv.round(4))
print("lstsq:        ", theta_lstsq.round(4))

lin_reg = LinearRegression().fit(X, y)
print("LinearRegression: θ₀ =", round(lin_reg.intercept_, 4), " θ₁ =", lin_reg.coef_.round(4))
print("x = 2.5 üçün proqnoz:", lin_reg.predict([[2.5]]).round(3))

# Əlamət sayı artdıqca XᵀX-in tərsini tapmaq bahalaşır (~n³)
for n in (200, 400, 800):
    A = rng.random((2000, n))
    t0 = time.perf_counter()
    np.linalg.pinv(A)
    print(f"n = {n:>4} əlamət: pinv {time.perf_counter() - t0:.3f} s")
