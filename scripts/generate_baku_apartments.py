""""Bakı mənzilləri" sintetik məlumat dəstinin generatoru.

Platforma üçün orijinal, deterministik (seed) məlumat dəsti yaradır:
    python scripts/generate_baku_apartments.py
Nəticə: public/data/baku-apartments.csv

Məlumat real elan saytlarından götürülməyib; qiymət modeli təlim
məqsədilə sadələşdirilib. Təmizləmə məşqi üçün bilərəkdən çatışmayan
qiymətlər və bir neçə yazı səhvi əlavə edilir.
"""
from pathlib import Path

import numpy as np
import pandas as pd

SEED = 2026
N = 2400
OUT = Path(__file__).resolve().parents[1] / "public" / "data" / "baku-apartments.csv"

# rayon: (enlik, uzunluq, 1 m² baza qiyməti AZN, metroya orta məsafə km, pay)
DISTRICTS = {
    "Səbail":    (40.356, 49.836, 3300, 0.9, 0.08),
    "Nəsimi":    (40.384, 49.833, 2900, 0.7, 0.14),
    "Yasamal":   (40.390, 49.800, 2500, 1.1, 0.14),
    "Nərimanov": (40.405, 49.868, 2300, 1.0, 0.13),
    "Xətai":     (40.383, 49.925, 2000, 1.4, 0.13),
    "Nizami":    (40.403, 49.950, 1800, 1.6, 0.10),
    "Binəqədi":  (40.447, 49.822, 1500, 2.8, 0.10),
    "Sabunçu":   (40.444, 49.950, 1250, 3.5, 0.07),
    "Suraxanı":  (40.420, 50.010, 1150, 4.5, 0.05),
    "Xəzər":     (40.425, 50.140, 1350, 7.0, 0.06),
}


def generate(seed: int = SEED, n: int = N) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    names = list(DISTRICTS)
    weights = np.array([DISTRICTS[d][4] for d in names])
    rayon = rng.choice(names, size=n, p=weights / weights.sum())

    lat = np.array([DISTRICTS[d][0] for d in rayon]) + rng.normal(0, 0.011, n)
    lon = np.array([DISTRICTS[d][1] for d in rayon]) + rng.normal(0, 0.014, n)
    base = np.array([DISTRICTS[d][2] for d in rayon], dtype=float)
    metro_mean = np.array([DISTRICTS[d][3] for d in rayon])

    yeni = rng.random(n) < 0.55
    tikili = np.where(yeni, "yeni", "köhnə")

    sahe = np.where(yeni, rng.lognormal(np.log(88), 0.33, n), rng.lognormal(np.log(64), 0.28, n))
    sahe = np.clip(sahe, 25, 320).round(1)
    otaq = np.clip(np.round(sahe / 30 + rng.normal(0, 0.45, n)), 1, 6).astype(int)

    bina = np.where(yeni, rng.integers(9, 26, n), rng.choice([4, 5, 9, 12], size=n, p=[0.2, 0.4, 0.3, 0.1]))
    mertebe = np.array([rng.integers(1, b + 1) for b in bina])

    temir = rng.choice(["əla", "orta", "təmirsiz"], size=n, p=[0.35, 0.45, 0.20])
    temir = np.where(yeni & (rng.random(n) < 0.25), "təmirsiz", temir)  # yeni tikililərdə "qara karkas"
    metro = np.round(rng.gamma(2.0, metro_mean / 2.0), 2)
    kupca = (rng.random(n) < np.where(yeni, 0.75, 0.95)).astype(int)

    per_m2 = base.copy()
    per_m2 *= np.where(yeni, 1.12, 1.0)
    per_m2 *= pd.Series(temir).map({"əla": 1.14, "orta": 1.0, "təmirsiz": 0.84}).to_numpy()
    per_m2 *= np.exp(-0.045 * metro)
    per_m2 *= np.where(mertebe == 1, 0.92, 1.0) * np.where((mertebe == bina) & ~yeni, 0.95, 1.0)
    per_m2 *= np.where(kupca == 1, 1.0, 0.84)
    per_m2 *= rng.lognormal(0, 0.10, n)
    qiymet = np.round(per_m2 * sahe, -2).astype(int)

    df = pd.DataFrame(
        {
            "id": np.arange(1, n + 1),
            "rayon": rayon,
            "enlik": lat.round(5),
            "uzunluq": lon.round(5),
            "sahe": sahe,
            "otaq_sayi": otaq.astype(float),
            "mertebe": mertebe,
            "bina_mertebe": bina,
            "tikili": tikili,
            "temir": temir,
            "metro_mesafe": metro,
            "kupca": kupca,
            "qiymet": qiymet,
        }
    )

    # Təmizləmə məşqi üçün "real həyat" problemləri:
    miss_metro = rng.random(n) < 0.04
    df.loc[miss_metro, "metro_mesafe"] = np.nan
    miss_rooms = rng.random(n) < 0.02
    df.loc[miss_rooms, "otaq_sayi"] = np.nan
    miss_temir = rng.random(n) < 0.03
    df.loc[miss_temir, "temir"] = np.nan
    typo = rng.choice(n, size=6, replace=False)  # sahə vergülsüz yazılıb: 72.5 → 725
    df.loc[typo, "sahe"] = (df.loc[typo, "sahe"] * 10).round(1)
    return df


if __name__ == "__main__":
    data = generate()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    data.to_csv(OUT, index=False, encoding="utf-8")
    print(f"{len(data)} sətir yazıldı → {OUT}")
