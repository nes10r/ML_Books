"""Gini və entropiya: kök düyünün ən yaxşı bölgüsünü əl ilə tapmaq və CART ilə müqayisə."""
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

from fruits import make_fruits

X, y = make_fruits()
X_train, _, y_train, _ = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)


def gini(labels):
    p = np.bincount(labels, minlength=3) / len(labels)
    return 1 - np.sum(p**2)


def entropy(labels):
    p = np.bincount(labels, minlength=3) / len(labels)
    p = p[p > 0]
    return -np.sum(p * np.log2(p))


print(f"Kök düyün: Gini = {gini(y_train):.3f}, entropiya = {entropy(y_train):.3f} bit")

# CART-ın etdiyi kimi: hər əlamət və hər mümkün hədd üçün çəkili qeyri-müəyyənlik
best = None
for k, name in enumerate(["diametr", "çəki"]):
    values = np.unique(X_train[:, k])
    for t in (values[:-1] + values[1:]) / 2:
        left, right = y_train[X_train[:, k] <= t], y_train[X_train[:, k] > t]
        cost = (len(left) * gini(left) + len(right) * gini(right)) / len(y_train)
        if best is None or cost < best[0]:
            best = (cost, name, t, len(left), len(right))
cost, name, t, nl, nr = best
print(f"Əl ilə tapılan ən yaxşı bölgü: {name} ≤ {t:.2f}  (sol {nl}, sağ {nr}, çəkili Gini = {cost:.3f})")

tree = DecisionTreeClassifier(max_depth=1, random_state=42).fit(X_train, y_train)
feat = ["diametr", "çəki"][tree.tree_.feature[0]]
print(f"Scikit-Learn (CART) kökdə:       {feat} ≤ {tree.tree_.threshold[0]:.2f}")

for criterion in ("gini", "entropy"):
    full = DecisionTreeClassifier(criterion=criterion, random_state=42).fit(X_train, y_train)
    print(f"{criterion:>8}: dərinlik = {full.get_depth()}, yarpaq sayı = {full.get_n_leaves()}")
