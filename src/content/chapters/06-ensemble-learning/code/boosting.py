"""AdaBoost, Gradient Boosting (erkən dayandırma ilə) və HistGradientBoosting."""
import numpy as np
from sklearn.datasets import load_digits, make_moons
from sklearn.ensemble import AdaBoostClassifier, GradientBoostingRegressor, HistGradientBoostingClassifier
from sklearn.metrics import root_mean_squared_error
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

# 1) AdaBoost: kötüklərdən (max_depth=1) güclü təsnifatçı
X, y = make_moons(n_samples=2000, noise=0.32, random_state=7)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=7)
stump = DecisionTreeClassifier(max_depth=1).fit(X_train, y_train)
ada = AdaBoostClassifier(DecisionTreeClassifier(max_depth=1), n_estimators=200, learning_rate=0.5, random_state=42)
ada.fit(X_train, y_train)
print(f"Tək kötük: {stump.score(X_test, y_test):.3f}   AdaBoost (200 kötük): {ada.score(X_test, y_test):.3f}")

# 2) Gradient Boosting: gün ərzində temperatur (Fəsil 5-in məlumatı)
rng = np.random.default_rng(seed=8)
hour = rng.uniform(0, 24, 200)
temp = 12 + 8 * np.sin((hour - 9) / 24 * 2 * np.pi) + rng.normal(0, 1.5, 200)
Xh_tr, Xh_te, yh_tr, yh_te = train_test_split(hour.reshape(-1, 1), temp, test_size=0.3, random_state=42)
for lr, n in [(1.0, 3), (0.1, 3), (0.1, 100)]:
    gbr = GradientBoostingRegressor(max_depth=2, n_estimators=n, learning_rate=lr, random_state=42).fit(Xh_tr, yh_tr)
    print(f"GBR η={lr:<4} ağac={n:<4} test RMSE = {root_mean_squared_error(yh_te, gbr.predict(Xh_te)):.2f}")
early = GradientBoostingRegressor(
    max_depth=2, learning_rate=0.05, n_estimators=1000, n_iter_no_change=10, validation_fraction=0.2, random_state=42
).fit(Xh_tr, yh_tr)
print(f"Erkən dayandırma: {early.n_estimators_} ağacdan sonra dayandı, test RMSE = "
      f"{root_mean_squared_error(yh_te, early.predict(Xh_te)):.2f}")

# 3) Histoqram əsaslı bustinq: böyük məlumatda sürətli
digits = load_digits()
Xd_tr, Xd_te, yd_tr, yd_te = train_test_split(digits.data, digits.target, test_size=0.2, stratify=digits.target, random_state=42)
hgb = HistGradientBoostingClassifier(random_state=42).fit(Xd_tr, yd_tr)
print(f"HistGradientBoosting (rəqəmlər): test = {hgb.score(Xd_te, yd_te):.3f}")
