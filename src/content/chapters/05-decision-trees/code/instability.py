"""Ağacların məhdudiyyətləri: ox istiqamətinə həssaslıq və yüksək dispersiya."""
import numpy as np
from sklearn.decomposition import PCA
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier

rng = np.random.default_rng(seed=1)
# Sərhəd diaqonaldır: x₂ > x₁ olduqda sinif 1
X = rng.uniform(0, 1, (400, 2))
y = (X[:, 1] > X[:, 0]).astype(int)

plain = DecisionTreeClassifier(random_state=42)
rotated = make_pipeline(StandardScaler(), PCA(), DecisionTreeClassifier(random_state=42))
for name, model in [("xam əlamətlər", plain), ("StandardScaler + PCA", rotated)]:
    acc = cross_val_score(model, X, y, cv=5).mean()
    model.fit(X, y)
    leaves = model.get_n_leaves() if hasattr(model, "get_n_leaves") else model[-1].get_n_leaves()
    print(f"{name:<22} CV dəqiqliyi = {acc:.3f}  yarpaq sayı = {leaves}")

# Yüksək dispersiya: eyni məlumatın fərqli təsadüfi alt-nümunələrində öyrədilmiş ağaclar
X2 = rng.normal(size=(300, 2))
y2 = (X2[:, 0] ** 2 + X2[:, 1] > 0.5).astype(int)
grid = np.c_[rng.uniform(-2, 2, 2000), rng.uniform(-2, 2, 2000)]
preds = []
for seed in range(5):
    idx = np.random.default_rng(seed).choice(len(X2), size=240, replace=False)
    t = DecisionTreeClassifier(max_depth=6, random_state=seed).fit(X2[idx], y2[idx])
    preds.append(t.predict(grid))
    print(f"alt-nümunə {seed}: kök bölgüsü x{t.tree_.feature[0] + 1} ≤ {t.tree_.threshold[0]:.2f}, yarpaq = {t.get_n_leaves()}")
preds = np.array(preds)
disagree = (preds != preds[0]).any(axis=0).mean()
print(f"Ağacların ən azı birinin fərqli cavab verdiyi nöqtələrin payı: {disagree:.1%}")
