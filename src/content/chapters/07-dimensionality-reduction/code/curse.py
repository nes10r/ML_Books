"""Ölçü lənəti: yüksək ölçülü fəzada məsafələr və “kənarlar”."""
import numpy as np

rng = np.random.default_rng(seed=0)
print(f"{'ölçü':>6} | {'orta məsafə':>12} | {'kənara 1%-dən yaxın':>20} | {'ən yaxın / ən uzaq':>18}")
for d in [2, 3, 10, 100, 1000, 10_000]:
    a, b = rng.random((2000, d)), rng.random((2000, d))
    mean_dist = np.linalg.norm(a - b, axis=1).mean()
    near_edge = np.mean((a < 0.01).any(axis=1) | (a > 0.99).any(axis=1))
    # bir sorğu nöqtəsi üçün 500 nöqtə arasında ən yaxın və ən uzaq məsafənin nisbəti
    pts, q = rng.random((500, d)), rng.random(d)
    dist = np.linalg.norm(pts - q, axis=1)
    print(f"{d:>6} | {mean_dist:>12.2f} | {near_edge:>19.1%} | {dist.min() / dist.max():>18.2f}")
