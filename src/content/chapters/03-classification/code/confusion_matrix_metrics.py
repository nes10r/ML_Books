"""Qarışıqlıq matrisi, precision, recall və F1."""
from sklearn.datasets import load_digits
from sklearn.linear_model import SGDClassifier
from sklearn.metrics import confusion_matrix, f1_score, precision_score, recall_score
from sklearn.model_selection import cross_val_predict, train_test_split

X, y = load_digits(return_X_y=True)
X_train, _, y_train, _ = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
y_train_5 = y_train == 5

# Hər nümunə üçün "təmiz" proqnoz: model həmin nümunəni təlimdə görməyib
y_pred = cross_val_predict(SGDClassifier(random_state=42), X_train, y_train_5, cv=3)

cm = confusion_matrix(y_train_5, y_pred)
tn, fp, fn, tp = cm.ravel()
print("Qarışıqlıq matrisi [[TN FP] [FN TP]]:")
print(cm)
print(f"TN={tn}  FP={fp}  FN={fn}  TP={tp}")

print(f"\nPrecision = TP/(TP+FP) = {tp}/({tp}+{fp}) = {precision_score(y_train_5, y_pred):.3f}")
print(f"Recall    = TP/(TP+FN) = {tp}/({tp}+{fn}) = {recall_score(y_train_5, y_pred):.3f}")
print(f"F1        = {f1_score(y_train_5, y_pred):.3f}")
