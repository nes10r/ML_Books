"""Səhvlərin təhlili: normallaşdırılmış qarışıqlıq matrisi və ən çox qarışdırılan cütlər."""
import numpy as np
from sklearn.datasets import load_digits
from sklearn.linear_model import SGDClassifier
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import cross_val_predict, train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_digits(return_X_y=True)
X_train, _, y_train, _ = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

model = make_pipeline(StandardScaler(), SGDClassifier(random_state=42))
y_pred = cross_val_predict(model, X_train, y_train, cv=3)
print(f"Ümumi dəqiqlik: {(y_pred == y_train).mean():.3f}  (səhv sayı: {(y_pred != y_train).sum()})")

cm = confusion_matrix(y_train, y_pred)
recall_per_class = cm.diagonal() / cm.sum(axis=1)
print("\nHər rəqəm üzrə recall:")
print("  " + "  ".join(f"{d}:{r:.2f}" for d, r in enumerate(recall_per_class)))

errors = cm.astype(float)
np.fill_diagonal(errors, 0)
pairs = sorted(((int(errors[i, j]), i, j) for i in range(10) for j in range(10) if errors[i, j] > 0), reverse=True)
print("\nƏn çox qarışdırılan cütlər (həqiqət → proqnoz):")
for count, true, pred in pairs[:5]:
    share = count / cm[true].sum()
    print(f"  {true} → {pred}: {count} dəfə ({share:.1%} — {true} rəqəmlərinin)")
