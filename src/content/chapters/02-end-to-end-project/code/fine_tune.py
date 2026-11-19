"""Hiperparametr axtarışı, əlamət əhəmiyyəti və test dəstində yekun qiymətləndirmə."""
import numpy as np
import pandas as pd
from scipy import stats
from scipy.stats import randint
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV, train_test_split
from sklearn.pipeline import Pipeline

from pipeline import preprocessing

apartments = pd.read_csv("baku-apartments.csv")
train, test = train_test_split(apartments, test_size=0.2, stratify=apartments["rayon"], random_state=42)
X_train, y_train = train.drop(columns=["id", "qiymet"]), train["qiymet"]
X_test, y_test = test.drop(columns=["id", "qiymet"]), test["qiymet"]

pipe = Pipeline([("prep", preprocessing), ("model", RandomForestRegressor(n_estimators=60, random_state=42, n_jobs=-1))])

# 1) Şəbəkə axtarışı: bütün kombinasiyalar (3 × 3 = 9 variant × 3 qat)
grid = GridSearchCV(
    pipe,
    {"model__max_features": [2, 4, 8], "model__min_samples_leaf": [1, 3, 10]},
    cv=3,
    scoring="neg_root_mean_squared_error",
)
grid.fit(X_train, y_train)
print("Ən yaxşı (grid):", grid.best_params_, f"CV RMSE = {-grid.best_score_:,.0f}")

# 2) Təsadüfi axtarış: eyni büdcə ilə daha geniş fəza
rnd = RandomizedSearchCV(
    pipe,
    {"model__max_features": randint(2, 16), "model__min_samples_leaf": randint(1, 12)},
    n_iter=9,
    cv=3,
    scoring="neg_root_mean_squared_error",
    random_state=42,
)
rnd.fit(X_train, y_train)
print("Ən yaxşı (random):", rnd.best_params_, f"CV RMSE = {-rnd.best_score_:,.0f}")

# 3) Əlamət əhəmiyyəti
best = rnd.best_estimator_ if rnd.best_score_ > grid.best_score_ else grid.best_estimator_
importances = best["model"].feature_importances_
names = best["prep"].get_feature_names_out()
top = sorted(zip(importances, names), reverse=True)[:6]
print("\nƏn vacib 6 əlamət:")
for imp, name in top:
    print(f"  {name:<32} {imp:.3f}")

# 4) Test dəstində BİR DƏFƏ yoxlama + 95% etibarlılıq intervalı
errors_sq = (best.predict(X_test) - y_test) ** 2
rmse = np.sqrt(errors_sq.mean())
low, high = np.sqrt(stats.t.interval(0.95, len(errors_sq) - 1, loc=errors_sq.mean(), scale=stats.sem(errors_sq)))
print(f"\nTest RMSE = {rmse:,.0f} AZN  (95% interval: {low:,.0f} – {high:,.0f})")
