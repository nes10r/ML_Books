"""Stoxastik və mini-paket qradiyent enmə, öyrənmə cədvəli və SGDRegressor."""
import numpy as np
from sklearn.linear_model import SGDRegressor

rng = np.random.default_rng(seed=7)
m = 100
X = 3 * rng.random((m, 1))
y = 3 + 1.8 * X[:, 0] + rng.normal(0, 0.5, m)
X_b = np.c_[np.ones((m, 1)), X]

t0, t1 = 5, 50


def learning_schedule(t):          # η(t) = t0 / (t + t1): addımlar tədricən kiçilir
    return t0 / (t + t1)


# Stoxastik GD: hər addımda BİR təsadüfi nümunə
theta = np.zeros(2)
for epoch in range(50):
    for i in range(m):
        idx = rng.integers(m)
        xi, yi = X_b[idx : idx + 1], y[idx : idx + 1]
        gradients = 2 * xi.T @ (xi @ theta - yi)
        theta = theta - learning_schedule(epoch * m + i) * gradients
print("SGD (50 epoxa):        θ =", theta.round(3))

# Mini-paket GD: hər addımda 16 nümunə
theta = np.zeros(2)
batch = 16
for epoch in range(50):
    order = rng.permutation(m)
    for start in range(0, m, batch):
        b = order[start : start + batch]
        gradients = 2 / len(b) * X_b[b].T @ (X_b[b] @ theta - y[b])
        theta = theta - 0.05 * gradients
print("Mini-paket (50 epoxa): θ =", theta.round(3))

sgd_reg = SGDRegressor(max_iter=1000, tol=1e-5, penalty=None, eta0=0.01, n_iter_no_change=100, random_state=42)
sgd_reg.fit(X, y)
print("SGDRegressor:          θ₀ =", sgd_reg.intercept_.round(3), " θ₁ =", sgd_reg.coef_.round(3))
