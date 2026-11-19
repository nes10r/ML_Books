"""Stacking: əsas modellərin proqnozları üzərində öyrənən “blender”."""
from sklearn.datasets import make_moons
from sklearn.ensemble import RandomForestClassifier, StackingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC

X, y = make_moons(n_samples=2000, noise=0.32, random_state=7)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=7)

base = [
    ("lr", LogisticRegression(random_state=42)),
    ("knn", KNeighborsClassifier(n_neighbors=15)),
    ("svc", SVC(probability=True, random_state=42)),
    ("rf", RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)),
]
stack = StackingClassifier(base, final_estimator=LogisticRegression(), cv=5)
stack.fit(X_train, y_train)
for name, est in stack.named_estimators_.items():
    print(f"{name:>4}: {est.score(X_test, y_test):.3f}")
print(f"Stacking: {stack.score(X_test, y_test):.3f}")
print("Blender-in əmsalları (hər əsas modelin “sinif 1” ehtimalına verdiyi çəki):", stack.final_estimator_.coef_.round(2))
