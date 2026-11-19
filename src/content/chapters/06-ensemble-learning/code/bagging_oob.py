"""Bagging, pasting və çanta xaricində (OOB) qiymətləndirmə."""
from sklearn.datasets import make_moons
from sklearn.ensemble import BaggingClassifier
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

X, y = make_moons(n_samples=2000, noise=0.32, random_state=7)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=7)

tree = DecisionTreeClassifier(random_state=42).fit(X_train, y_train)
print(f"Tək ağac:            test = {tree.score(X_test, y_test):.3f}")

for name, bootstrap in [("Bagging (qaytarmaqla)", True), ("Pasting (qaytarmadan)", False)]:
    ens = BaggingClassifier(
        DecisionTreeClassifier(), n_estimators=300, max_samples=300, bootstrap=bootstrap,
        n_jobs=-1, random_state=42,
    ).fit(X_train, y_train)
    print(f"{name}: test = {ens.score(X_test, y_test):.3f}")

oob = BaggingClassifier(
    DecisionTreeClassifier(), n_estimators=300, max_samples=300, bootstrap=True,
    oob_score=True, n_jobs=-1, random_state=42,
).fit(X_train, y_train)
print(f"\nOOB qiymətləndirmə = {oob.oob_score_:.3f}   (test dəsti: {oob.score(X_test, y_test):.3f})")
print("İlk nümunə üçün OOB ehtimalları:", oob.oob_decision_function_[0].round(3))
