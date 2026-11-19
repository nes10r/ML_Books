"""Fəsil 5 skriptləri üçün ortaq sintetik "meyvələr" məlumatı (naringi, alma, nar)."""
import numpy as np

FRUITS = ["naringi", "alma", "nar"]


def make_fruits(n_per_class=60, seed=5):
    """Diametr (sm) və çəki (q). Çəki təxminən diametrin kubu ilə artır, növlər isə qismən üst-üstə düşür."""
    rng = np.random.default_rng(seed)
    params = [(5.5, 0.55, 0.62), (7.2, 0.7, 0.68), (8.6, 0.8, 0.82)]  # orta diametr, std, sıxlıq əmsalı
    X, y = [], []
    for label, (mu, sd, density) in enumerate(params):
        d = rng.normal(mu, sd, n_per_class)
        w = density * 0.52 * d**3 * rng.lognormal(0, 0.1, n_per_class)  # ≈ sıxlıq × kürənin həcmi
        X.append(np.c_[d, w])
        y.append(np.full(n_per_class, label))
    return np.round(np.vstack(X), 1), np.concatenate(y)
