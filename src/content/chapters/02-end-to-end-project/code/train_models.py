"""Üç modelin təlimi: təlim xətası və çarpaz validasiya ilə müqayisə."""
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import root_mean_squared_error
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.tree import DecisionTreeRegressor

from pipeline import preprocessing  # əvvəlki addımın pipeline.py faylı (eyni qovluqda)

apartments = pd.read_csv("baku-apartments.csv")
train, test = train_test_split(apartments, test_size=0.2, stratify=apartments["rayon"], random_state=42)
X_train, y_train = train.drop(columns=["id", "qiymet"]), train["qiymet"]

models = {
    "Xətti reqressiya": LinearRegression(),
    "Qərar ağacı": DecisionTreeRegressor(random_state=42),
    "Təsadüfi meşə": RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1),
}

print(f"{'model':<18} {'təlim RMSE':>11} {'CV RMSE (10 qat)':>20}")
for name, model in models.items():
    pipe = make_pipeline(preprocessing, model)
    pipe.fit(X_train, y_train)
    train_rmse = root_mean_squared_error(y_train, pipe.predict(X_train))
    cv = -cross_val_score(pipe, X_train, y_train, cv=10, scoring="neg_root_mean_squared_error")
    print(f"{name:<18} {train_rmse:>11,.0f} {cv.mean():>12,.0f} ± {cv.std():>5,.0f}")
