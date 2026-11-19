"""Paket (batch) qradiyent enmə: öyrənmə sürətinin və miqyaslamanın təsiri."""
import numpy as np

rng = np.random.default_rng(seed=7)
m = 100
X = 3 * rng.random((m, 1))
y = 3 + 1.8 * X[:, 0] + rng.normal(0, 0.5, m)
X_b = np.c_[np.ones((m, 1)), X]


def batch_gd(X_b, y, eta, n_epochs=1000):
    theta = np.zeros(X_b.shape[1])
    with np.errstate(over="ignore", invalid="ignore"):  # uzaqlaşmanı bilərəkdən göstəririk
        for epoch in range(n_epochs):
            gradients = 2 / len(y) * X_b.T @ (X_b @ theta - y)   # ∇MSE(θ)
            theta = theta - eta * gradients
            if not np.isfinite(theta).all():
                return theta, epoch
    return theta, n_epochs


for eta in (0.02, 0.1, 0.5):
    theta, epochs = batch_gd(X_b, y, eta)
    status = "uzaqlaşdı!" if not np.isfinite(theta).all() else f"θ = {theta.round(3)}"
    print(f"η = {eta:<4} → {epochs:>4} epoxa: {status}")

# Miqyaslama: ikinci əlamət 0–1000 aralığındadır (məs. sm əvəzinə mm)
X2 = np.c_[np.ones(m), X[:, 0], 1000 * rng.random(m)]
y2 = 3 + 1.8 * X2[:, 1] + 0.004 * X2[:, 2] + rng.normal(0, 0.5, m)
theta, _ = batch_gd(X2, y2, eta=1e-6, n_epochs=1000)
print(f"\nMiqyaslanmamış (η=1e-6, 1000 epoxa): θ = {theta.round(3)}, MSE = {np.mean((X2 @ theta - y2) ** 2):.3f}")
mu, sigma = X2[:, 1:].mean(axis=0), X2[:, 1:].std(axis=0)
X2s = np.c_[np.ones(m), (X2[:, 1:] - mu) / sigma]
theta_s, _ = batch_gd(X2s, y2, eta=0.1, n_epochs=1000)
print(f"Standartlaşdırılmış (η=0.1, 1000 epoxa): MSE = {np.mean((X2s @ theta_s - y2) ** 2):.3f}")
