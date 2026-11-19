"""Polinom reqressiya və öyrənmə əyriləri ilə underfitting/overfitting diaqnozu."""
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import learning_curve
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures, StandardScaler

rng = np.random.default_rng(seed=3)
m = 120
X = 6 * rng.random((m, 1)) - 3                              # [-3, 3)
y = 2 - 1.2 * X[:, 0] + 0.5 * X[:, 0] ** 2 + rng.normal(0, 0.8, m)

poly = PolynomialFeatures(degree=2, include_bias=False)
X_poly = poly.fit_transform(X)
print("x[0] =", X[0].round(3), "→ [x, x²] =", X_poly[0].round(3))
lin = LinearRegression().fit(X_poly, y)
print("Öyrənilmiş: ŷ =", lin.intercept_.round(2), "+", lin.coef_[0].round(2), "x +", lin.coef_[1].round(2), "x²")
print("Həqiqi:     y = 2 - 1.2 x + 0.5 x²\n")

for degree in (1, 2, 10):
    model = make_pipeline(PolynomialFeatures(degree, include_bias=False), StandardScaler(), LinearRegression())
    sizes, train_scores, val_scores = learning_curve(
        model, X, y, train_sizes=[10, 30, 60, 96], cv=5, scoring="neg_root_mean_squared_error"
    )
    tr, va = -train_scores.mean(axis=1), -val_scores.mean(axis=1)
    cells = "  ".join(f"m={s}: {t:.2f}/{v:.2f}" for s, t, v in zip(sizes, tr, va))
    print(f"dərəcə {degree:>2} (təlim/validasiya RMSE)  {cells}")
