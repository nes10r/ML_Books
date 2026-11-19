"""partial_fit ilə onlayn öyrənmə.

Məlumat kiçik paketlərlə (mini-batch) gəlir və model hər paketdən sonra
yenilənir — bütün məlumatı yaddaşda saxlamağa ehtiyac yoxdur.
"""
import numpy as np
from sklearn.linear_model import SGDRegressor

rng = np.random.default_rng(seed=0)


def next_batch(size=20):
    """Real sistemdə bu, verilənlər bazasından və ya axından oxuma olardı."""
    x = rng.uniform(0, 1, size=(size, 1))
    y = 0.15 + 0.7 * x[:, 0] + rng.normal(0, 0.06, size=size)
    return x, y


model = SGDRegressor(learning_rate="constant", eta0=0.05, random_state=0)

for step in range(1, 51):
    X_batch, y_batch = next_batch()
    model.partial_fit(X_batch, y_batch)  # bir addımlıq yeniləmə
    if step % 10 == 0:
        print(
            f"Paket {step:2d}: θ₀ = {model.intercept_[0]:.3f}, "
            f"θ₁ = {model.coef_[0]:.3f}"
        )

print("Həqiqi qiymətlər: θ₀ = 0.150, θ₁ = 0.700")
