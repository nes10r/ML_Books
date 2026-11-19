"""Təsadüfi meşə, Extra-Trees və əlamət əhəmiyyəti."""
import numpy as np
from sklearn.datasets import load_digits, make_moons
from sklearn.ensemble import ExtraTreesClassifier, RandomForestClassifier
from sklearn.model_selection import cross_val_score, train_test_split

X, y = make_moons(n_samples=2000, noise=0.32, random_state=7)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=7)
for name, model in [
    ("RandomForest", RandomForestClassifier(n_estimators=300, max_leaf_nodes=16, n_jobs=-1, random_state=42)),
    ("ExtraTrees", ExtraTreesClassifier(n_estimators=300, max_leaf_nodes=16, n_jobs=-1, random_state=42)),
]:
    model.fit(X_train, y_train)
    print(f"{name:<13} test = {model.score(X_test, y_test):.3f}")

# Rəqəm şəkillərində hansı piksellər vacibdir?
digits = load_digits()
rf = RandomForestClassifier(n_estimators=300, random_state=42, n_jobs=-1)
print(f"\nRəqəmlər, 5 qatlı CV = {cross_val_score(rf, digits.data, digits.target, cv=5).mean():.3f}")
rf.fit(digits.data, digits.target)
imp = rf.feature_importances_.reshape(8, 8)
shades = " .:-=+*#%@"
print("Piksellərin əhəmiyyəti (8×8, tünd = vacib):")
for row in imp:
    print("  " + "".join(shades[min(9, int(v / imp.max() * 9.99))] * 2 for v in row))
print(f"Kənar sütunlardakı (0 və 7) piksellərin ümumi əhəmiyyəti: {imp[:, [0, 7]].sum():.3f}")
print(f"Mərkəzi 4×4 blokun ümumi əhəmiyyəti: {imp[2:6, 2:6].sum():.3f}")
