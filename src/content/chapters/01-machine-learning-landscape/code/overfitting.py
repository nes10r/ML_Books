"""Polinomun dərəcəsi artdıqca təlim və validasiya xətasının dəyişməsi."""
import numpy as np
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.metrics import root_mean_squared_error
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures, StandardScaler

rng = np.random.default_rng(seed=11)
x = rng.uniform(0, 1, size=24)
y = 0.8 * np.sin(2 * np.pi * x) + 0.3 * x + rng.normal(0, 0.22, size=24)
X = x.reshape(-1, 1)

X_train, X_val, y_train, y_val = train_test_split(
    X, y, test_size=0.5, random_state=0
)


def poly_model(degree, regressor):
    return make_pipeline(
        PolynomialFeatures(degree=degree, include_bias=False),
        StandardScaler(),
        regressor,
    )


print(f"{'dərəcə':>7} | {'təlim RMSE':>10} | {'validasiya RMSE':>15}")
for degree in [1, 3, 5, 8, 11]:
    model = poly_model(degree, LinearRegression())
    model.fit(X_train, y_train)
    train_rmse = root_mean_squared_error(y_train, model.predict(X_train))
    val_rmse = root_mean_squared_error(y_val, model.predict(X_val))
    print(f"{degree:>7} | {train_rmse:>10.3f} | {val_rmse:>15.3f}")

# Requlyarlaşdırma: eyni 11-ci dərəcəli model, lakin Ridge ilə
for alpha in [0.001, 0.1]:
    model = poly_model(11, Ridge(alpha=alpha)).fit(X_train, y_train)
    val_rmse = root_mean_squared_error(y_val, model.predict(X_val))
    print(f"Ridge(alpha={alpha}) 11-ci dərəcə → validasiya RMSE = {val_rmse:.3f}")
