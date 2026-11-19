"""Reqressiya ağacı: gün ərzində temperaturun proqnozu (sintetik məlumat)."""
import numpy as np
from sklearn.metrics import root_mean_squared_error
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor, export_text

rng = np.random.default_rng(seed=8)
hour = rng.uniform(0, 24, 200)
temp = 12 + 8 * np.sin((hour - 9) / 24 * 2 * np.pi) + rng.normal(0, 1.5, 200)
X = hour.reshape(-1, 1)
X_train, X_test, y_train, y_test = train_test_split(X, temp, test_size=0.3, random_state=42)

shallow = DecisionTreeRegressor(max_depth=2, random_state=42).fit(X_train, y_train)
print(export_text(shallow, feature_names=["saat"], decimals=1))

for name, model in [
    ("max_depth=2", shallow),
    ("max_depth=4", DecisionTreeRegressor(max_depth=4, random_state=42)),
    ("məhdudiyyətsiz", DecisionTreeRegressor(random_state=42)),
    ("min_samples_leaf=10", DecisionTreeRegressor(min_samples_leaf=10, random_state=42)),
]:
    model.fit(X_train, y_train)
    tr = root_mean_squared_error(y_train, model.predict(X_train))
    te = root_mean_squared_error(y_test, model.predict(X_test))
    print(f"{name:<20} yarpaq = {model.get_n_leaves():>3}  təlim RMSE = {tr:.2f}  test RMSE = {te:.2f}")
