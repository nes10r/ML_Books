"""Çoxetiketli və çoxçıxışlı təsnifat."""
import numpy as np
from sklearn.datasets import load_digits
from sklearn.metrics import f1_score
from sklearn.model_selection import cross_val_predict, train_test_split
from sklearn.neighbors import KNeighborsClassifier

X, y = load_digits(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

# 1) Çoxetiketli: hər şəkil üçün iki etiket — "böyükdür (≥7)" və "təkdir"
y_multilabel = np.c_[y_train >= 7, y_train % 2 == 1]
knn = KNeighborsClassifier()
knn.fit(X_train, y_multilabel)
print("Rəqəm", y_test[0], "→ [böyük, tək] =", knn.predict(X_test[:1])[0])

y_pred = cross_val_predict(knn, X_train, y_multilabel, cv=3)
print(f"F1 (macro, etiketlər bərabər çəkili):   {f1_score(y_multilabel, y_pred, average='macro'):.3f}")
print(f"F1 (weighted, dəstəyə görə çəkili):     {f1_score(y_multilabel, y_pred, average='weighted'):.3f}")

# 2) Çoxçıxışlı: küylü şəkildən təmiz şəkli bərpa etmək (64 çıxış, hər biri 0–16)
rng = np.random.default_rng(42)
X_train_noisy = np.clip(X_train + rng.integers(0, 9, X_train.shape), 0, 16)
X_test_noisy = np.clip(X_test + rng.integers(0, 9, X_test.shape), 0, 16)
denoiser = KNeighborsClassifier().fit(X_train_noisy, X_train)
cleaned = denoiser.predict(X_test_noisy)
print(f"\nOrta mütləq piksel xətası: küylü {np.abs(X_test_noisy - X_test).mean():.2f} "
      f"→ təmizlənmiş {np.abs(cleaned - X_test).mean():.2f}")
