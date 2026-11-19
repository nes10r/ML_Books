"""Xətti reqressiya: vektor şəklində proqnoz və MSE xərc funksiyası."""
import numpy as np

rng = np.random.default_rng(seed=7)
m = 100
X = 3 * rng.random((m, 1))                       # bir əlamət, [0, 3)
y = 3 + 1.8 * X[:, 0] + rng.normal(0, 0.5, m)    # həqiqi parametrlər: θ₀ = 3, θ₁ = 1.8

X_b = np.c_[np.ones((m, 1)), X]                  # x₀ = 1 sütunu → θ₀ də vektora daxil olur
print("X_b forması:", X_b.shape)

for theta in (np.array([0.0, 0.0]), np.array([2.0, 2.0]), np.array([3.0, 1.8])):
    y_hat = X_b @ theta                          # ŷ = X_b · θ  (bütün nümunələr bir əməliyyatla)
    mse = np.mean((y_hat - y) ** 2)
    print(f"θ = {theta} → MSE = {mse:.3f}")
