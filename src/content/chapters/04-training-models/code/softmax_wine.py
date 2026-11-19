"""Softmax reqressiyası: üç sinifli şərab məlumatı (scikit-learn ilə gəlir)."""
import numpy as np
from sklearn.datasets import load_wine
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import log_loss
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

wine = load_wine()
X, y = wine.data, wine.target
print("Forma:", X.shape, "| siniflər:", np.bincount(y), "| ilk əlamətlər:", wine.feature_names[:3])

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)
softmax = make_pipeline(StandardScaler(), LogisticRegression(C=1.0, max_iter=1000))
softmax.fit(X_tr, y_tr)                       # 3 sinif → avtomatik multinomial (softmax)

proba = softmax.predict_proba(X_te[:3])
print("\nİlk 3 test nümunəsi üçün ehtimallar (sinif 0, 1, 2):")
for p, true in zip(proba, y_te[:3]):
    print(f"  {np.round(p, 3)}  cəmi = {p.sum():.1f}  proqnoz = {p.argmax()}  həqiqət = {true}")

print(f"\nTest dəqiqliyi = {softmax.score(X_te, y_te):.3f}, çarpaz entropiya = {log_loss(y_te, softmax.predict_proba(X_te)):.3f}")
print(f"5 qatlı CV dəqiqliyi = {cross_val_score(softmax, X_tr, y_tr, cv=5).mean():.3f}")
print("Əmsallar matrisi forması (sinif × əlamət):", softmax[-1].coef_.shape)
