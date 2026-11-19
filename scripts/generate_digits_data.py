"""Fəsil 3 üçün məlumat fayllarını yaradır (deterministik):

    python scripts/generate_digits_data.py

1) public/data/digits-8x8.csv — scikit-learn `load_digits` dəsti (UCI Optical
   Recognition of Handwritten Digits, CC BY 4.0): 1 797 şəkil, 8×8 piksel (0–16).
2) public/data/digits-model-outputs.csv — təlim hissəsi üçün çarpaz validasiya
   (cross_val_predict) ilə alınmış model çıxışları. Brauzer demoları onları
   yenidən hesablamadan istifadə edir.
"""
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.datasets import load_digits
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import SGDClassifier
from sklearn.model_selection import cross_val_predict, train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

OUT = Path(__file__).resolve().parents[1] / "public" / "data"


def main() -> None:
    digits = load_digits()
    X, y = digits.data.astype(int), digits.target
    ids = np.arange(1, len(y) + 1)

    raw = pd.DataFrame(X, columns=[f"p{i}" for i in range(64)])
    raw.insert(0, "label", y)
    raw.insert(0, "id", ids)
    OUT.mkdir(parents=True, exist_ok=True)
    raw.to_csv(OUT / "digits-8x8.csv", index=False)

    X_train, _, y_train, _, id_train, _ = train_test_split(
        X, y, ids, test_size=0.2, stratify=y, random_state=42
    )
    y_train_5 = y_train == 5

    sgd = SGDClassifier(random_state=42)
    sgd_scores = cross_val_predict(sgd, X_train, y_train_5, cv=3, method="decision_function")
    forest = RandomForestClassifier(n_estimators=100, random_state=42)
    forest_proba = cross_val_predict(forest, X_train, y_train_5, cv=3, method="predict_proba")[:, 1]

    multi = make_pipeline(StandardScaler(), SGDClassifier(random_state=42))
    multi_pred = cross_val_predict(multi, X_train, y_train, cv=3)

    out = pd.DataFrame(
        {
            "id": id_train,
            "label": y_train,
            "is_5": y_train_5.astype(int),
            "sgd_score": np.round(sgd_scores, 2),
            "forest_proba": np.round(forest_proba, 3),
            "multi_pred": multi_pred,
        }
    ).sort_values("id")
    out.to_csv(OUT / "digits-model-outputs.csv", index=False)
    print(f"digits-8x8.csv: {len(raw)} sətir; digits-model-outputs.csv: {len(out)} sətir")


if __name__ == "__main__":
    main()
