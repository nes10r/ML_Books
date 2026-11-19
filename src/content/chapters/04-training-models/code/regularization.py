"""Ridge, Lasso, Elastic Net və erkən dayandırma."""
from copy import deepcopy

import numpy as np
from sklearn.linear_model import ElasticNet, Lasso, LinearRegression, Ridge, SGDRegressor
from sklearn.metrics import root_mean_squared_error
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(seed=11)
m, n = 60, 8
X = rng.normal(size=(m, n))
true_w = np.array([3.0, -2.0, 1.5, 0.0, 0.0, 0.0, 0.5, 0.0])   # 4 əlamət faydasızdır
y = 1 + X @ true_w + rng.normal(0, 1.0, m)

np.set_printoptions(precision=2, suppress=True)
print("Həqiqi:      ", true_w)
for name, model in [
    ("LinearReg", LinearRegression()),
    ("Ridge α=10", Ridge(alpha=10)),
    ("Lasso α=0.3", Lasso(alpha=0.3)),
    ("ElasticNet", ElasticNet(alpha=0.3, l1_ratio=0.5)),
]:
    w = model.fit(X, y).coef_
    print(f"{name:<12} {w}  sıfır əmsal: {np.sum(np.abs(w) < 1e-8)}")

# Erkən dayandırma: validasiya xətası artmağa başlayanda ən yaxşı modeli saxlayırıq
X_tr, X_val, y_tr, y_val = train_test_split(X, y, test_size=0.3, random_state=0)
scaler = StandardScaler().fit(X_tr)
X_tr_s, X_val_s = scaler.transform(X_tr), scaler.transform(X_val)
sgd = SGDRegressor(penalty=None, eta0=0.002, learning_rate="constant", random_state=42)
best_rmse, best_epoch, best_model = float("inf"), None, None
for epoch in range(500):
    sgd.partial_fit(X_tr_s, y_tr)
    rmse = root_mean_squared_error(y_val, sgd.predict(X_val_s))
    if rmse < best_rmse:
        best_rmse, best_epoch, best_model = rmse, epoch, deepcopy(sgd)
print(f"\nErkən dayandırma: ən yaxşı epoxa = {best_epoch}, validasiya RMSE = {best_rmse:.3f}")
