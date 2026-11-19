"""ROC əyrisi və AUC: SGD ilə təsadüfi meşənin müqayisəsi."""
from sklearn.datasets import load_digits
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import SGDClassifier
from sklearn.metrics import average_precision_score, roc_auc_score, roc_curve
from sklearn.model_selection import cross_val_predict, train_test_split

X, y = load_digits(return_X_y=True)
X_train, _, y_train, _ = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
y_train_5 = y_train == 5

sgd_scores = cross_val_predict(SGDClassifier(random_state=42), X_train, y_train_5, cv=3, method="decision_function")
# Təsadüfi meşədə decision_function yoxdur — müsbət sinfin ehtimalını bal kimi istifadə edirik
forest_proba = cross_val_predict(
    RandomForestClassifier(n_estimators=100, random_state=42), X_train, y_train_5, cv=3, method="predict_proba"
)[:, 1]

for name, s in [("SGD", sgd_scores), ("Təsadüfi meşə", forest_proba)]:
    fpr, tpr, _ = roc_curve(y_train_5, s)
    print(f"{name:<14} ROC AUC = {roc_auc_score(y_train_5, s):.4f}   "
          f"PR AUC (AP) = {average_precision_score(y_train_5, s):.4f}   "
          f"FPR=1% olduqda TPR = {tpr[fpr <= 0.01].max():.3f}")
