"""Əlyazma rəqəmlər məlumatı: yükləmə, ilk baxış və test dəstinin ayrılması."""
import numpy as np
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split

digits = load_digits()  # scikit-learn ilə gəlir, internet tələb etmir
X, y = digits.data, digits.target
print("X:", X.shape, "| y:", y.shape, "| piksel diapazonu:", X.min(), "–", X.max())

# Bir şəkli mətn "qrafikası" ilə göstərək: hər piksel 0 (ağ) – 16 (qara)
image = X[0].reshape(8, 8)
shades = " .:-=+*#%@"
print(f"\nBirinci şəkil (etiket = {y[0]}):")
for row in image:
    print("  " + "".join(shades[int(v * (len(shades) - 1) / 16)] * 2 for v in row))

counts = np.bincount(y)
print("\nHər rəqəmin sayı:", dict(enumerate(counts.tolist())))

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)
print(f"Təlim: {len(X_train)} şəkil, test: {len(X_test)} şəkil")
