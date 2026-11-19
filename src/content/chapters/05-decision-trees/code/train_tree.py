"""Qərar ağacının təlimi, mətn şəklində vizuallaşdırılması və proqnoz."""
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, export_text

from fruits import FRUITS, make_fruits

X, y = make_fruits()
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)

tree = DecisionTreeClassifier(max_depth=2, random_state=42)
tree.fit(X_train, y_train)
print(export_text(tree, feature_names=["diametr", "çəki"], class_names=FRUITS, show_weights=True))

new = [[7.0, 120.0]]
print("7 sm, 120 q → proqnoz:", FRUITS[tree.predict(new)[0]])
print("Ehtimallar (naringi, alma, nar):", tree.predict_proba(new).round(3)[0])
print("Yarpaq nömrəsi (apply):", tree.apply(new)[0])
print(f"Test dəqiqliyi (dərinlik 2): {tree.score(X_test, y_test):.3f}")
