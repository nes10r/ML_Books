"""Precision/recall kompromisi: qərar həddini seçmək."""
import numpy as np
from sklearn.datasets import load_digits
from sklearn.linear_model import SGDClassifier
from sklearn.metrics import precision_recall_curve, precision_score, recall_score
from sklearn.model_selection import cross_val_predict, train_test_split

X, y = load_digits(return_X_y=True)
X_train, _, y_train, _ = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
y_train_5 = y_train == 5

# predict() əvəzinə xam qərar ballarını alırıq
scores = cross_val_predict(SGDClassifier(random_state=42), X_train, y_train_5, cv=3, method="decision_function")
print("İlk 5 bal:", np.round(scores[:5], 1))

for threshold in [-500, 0, 500]:
    pred = scores >= threshold
    print(f"hədd={threshold:>5}: precision={precision_score(y_train_5, pred):.3f} "
          f"recall={recall_score(y_train_5, pred):.3f} müsbət proqnoz={pred.sum()}")

precisions, recalls, thresholds = precision_recall_curve(y_train_5, scores)
idx = (precisions[:-1] >= 0.98).argmax()  # precision ≥ 98% verən ən kiçik hədd
t98 = thresholds[idx]
pred98 = scores >= t98
print(f"\nPrecision ≥ 98% üçün hədd ≈ {t98:.1f}: "
      f"precision={precision_score(y_train_5, pred98):.3f}, recall={recall_score(y_train_5, pred98):.3f}")
