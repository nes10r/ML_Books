"""Model əsaslı və nümunə əsaslı öyrənmənin müqayisəsi.

Sintetik məlumat: mənzilin sahəsi (m²) → qiyməti (min ₼).
"""
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.neighbors import KNeighborsRegressor

rng = np.random.default_rng(seed=42)

# 1. Məlumatı hazırlayırıq: X mütləq 2 ölçülü olmalıdır (nümunələr × əlamətlər)
area = rng.uniform(35, 160, size=40)
price = 18 + 1.45 * area + rng.normal(0, 14, size=40)
X = area.reshape(-1, 1)
y = price

# 2. Model əsaslı: xətti reqressiya parametrləri (θ₀, θ₁) öyrənir
lin_reg = LinearRegression()
lin_reg.fit(X, y)
print(f"θ₀ (kəsişmə) = {lin_reg.intercept_:.2f}")
print(f"θ₁ (meyl)    = {lin_reg.coef_[0]:.3f}")

# 3. Nümunə əsaslı: k-NN təlim nümunələrini yadda saxlayır
knn_reg = KNeighborsRegressor(n_neighbors=3)
knn_reg.fit(X, y)

# 4. Yeni mənzil üçün proqnoz
X_new = np.array([[100.0]])
print(f"Xətti reqressiya proqnozu (100 m²): {lin_reg.predict(X_new)[0]:.1f} min ₼")
print(f"3-NN proqnozu (100 m²):            {knn_reg.predict(X_new)[0]:.1f} min ₼")
