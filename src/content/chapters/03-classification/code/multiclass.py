"""Çoxsinifli təsnifat: SVC (OvO), OvR strategiyası və miqyaslamanın təsiri."""
from sklearn.datasets import load_digits
from sklearn.linear_model import SGDClassifier
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.multiclass import OneVsRestClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

X, y = load_digits(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

svm = SVC(random_state=42).fit(X_train, y_train)  # daxildə 10·9/2 = 45 ikili təsnifatçı (OvO)
scores = svm.decision_function(X_train[:1])
print("SVC: sinif sayı =", len(svm.classes_), "| ilk şəkil üçün ballar:", scores.round(2))
print("Proqnoz:", svm.predict(X_train[:1]), "| həqiqət:", y_train[:1])

ovr = OneVsRestClassifier(SVC(random_state=42)).fit(X_train, y_train)
print("OvR daxilindəki təsnifatçı sayı:", len(ovr.estimators_))

models = {
    "SGD (xam)": SGDClassifier(random_state=42),
    "SGD + StandardScaler": make_pipeline(StandardScaler(), SGDClassifier(random_state=42)),
    "SVC": SVC(random_state=42),
}
for name, model in models.items():
    acc = cross_val_score(model, X_train, y_train, cv=3, scoring="accuracy").mean()
    print(f"{name:<22} CV dəqiqliyi = {acc:.3f}")
