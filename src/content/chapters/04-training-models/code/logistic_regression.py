"""Logistik reqressiya: ehtimal, log itki və qərar sərhədi (sintetik "imtahan" məlumatı)."""
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import log_loss
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(seed=4)
m = 300
study = rng.uniform(0, 10, m)                 # həftəlik oxuma saatı
sleep = rng.uniform(4, 9, m)                  # imtahandan əvvəlki yuxu saatı
logit = -9 + 0.9 * study + 0.8 * sleep        # gizli "həqiqi" əlaqə
passed = rng.random(m) < 1 / (1 + np.exp(-logit))
X = np.c_[study, sleep]

X_tr, X_te, y_tr, y_te = train_test_split(X, passed, test_size=0.25, random_state=42, stratify=passed)
clf = LogisticRegression().fit(X_tr, y_tr)
print("θ₀ =", clf.intercept_.round(3), " θ =", clf.coef_.round(3))
print(f"Test dəqiqliyi = {clf.score(X_te, y_te):.3f}, log itki = {log_loss(y_te, clf.predict_proba(X_te)):.3f}")

for s, sl in [(2, 6), (5, 7), (8, 8)]:
    p = clf.predict_proba([[s, sl]])[0, 1]
    print(f"oxuma {s} saat, yuxu {sl} saat → keçmə ehtimalı {p:.2f}")

# Qərar sərhədi: θ₀ + θ₁·oxuma + θ₂·yuxu = 0  →  yuxu 7 saat olduqda neçə saat oxumaq lazımdır?
(t1, t2), t0 = clf.coef_[0], clf.intercept_[0]
print(f"Yuxu 7 saat olduqda sərhəd: oxuma ≈ {-(t0 + t2 * 7) / t1:.2f} saat")

for C in (0.01, 1, 100):
    w = LogisticRegression(C=C).fit(X_tr, y_tr).coef_[0]
    print(f"C = {C:<5} → θ = {w.round(3)}  (kiçik C = güclü requlyarlaşdırma)")
