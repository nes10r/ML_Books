"""Təlim/test bölgüsü və çarpaz validasiya ilə model seçimi."""
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.neighbors import KNeighborsRegressor

rng = np.random.default_rng(seed=1)
area = rng.uniform(35, 160, size=200)
price = 18 + 1.45 * area + rng.normal(0, 14, size=200)
X, y = area.reshape(-1, 1), price

# 1. Test dəstini ayırıb "kilidləyirik"
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 2. Model seçimi yalnız təlim hissəsində çarpaz validasiya ilə aparılır
candidates = {
    "Xətti reqressiya": LinearRegression(),
    "1-NN": KNeighborsRegressor(n_neighbors=1),
    "10-NN": KNeighborsRegressor(n_neighbors=10),
}
for name, model in candidates.items():
    scores = cross_val_score(
        model, X_train, y_train, cv=5, scoring="neg_root_mean_squared_error"
    )
    print(f"{name:<17} CV RMSE = {-scores.mean():.2f} ± {scores.std():.2f}")

# 3. Seçilmiş modeli bütün təlim hissəsində öyrədib test dəstində BİR DƏFƏ yoxlayırıq
best = LinearRegression().fit(X_train, y_train)
test_rmse = np.sqrt(np.mean((best.predict(X_test) - y_test) ** 2))
print(f"Seçilmiş modelin test RMSE-si: {test_rmse:.2f}")
