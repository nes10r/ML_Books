"""Məlumatın hazırlanması: boşluqlar, kateqoriyalar və miqyaslama."""
import numpy as np
import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder, OrdinalEncoder, StandardScaler

apartments = pd.read_csv("baku-apartments.csv")

# 1) Çatışmayan ədədi qiymətləri median ilə doldurmaq
imputer = SimpleImputer(strategy="median")
num = apartments[["otaq_sayi", "metro_mesafe"]]
num_filled = imputer.fit_transform(num)
print("Öyrənilmiş medianlar:", dict(zip(num.columns, imputer.statistics_)))
print("Doldurulandan sonra boşluq sayı:", int(np.isnan(num_filled).sum()))

# 2) Sıralı kateqoriya: təmir səviyyəsinin təbii sırası var
temir = apartments[["temir"]].fillna("orta")
ordinal = OrdinalEncoder(categories=[["təmirsiz", "orta", "əla"]])
print("\nTəmir kodları:", ordinal.fit_transform(temir[:5]).ravel(), "←", temir["temir"][:5].tolist())

# 3) Sırasız kateqoriya: rayonlar arasında sıra yoxdur → one-hot
onehot = OneHotEncoder(handle_unknown="ignore")
rayon_1hot = onehot.fit_transform(apartments[["rayon"]])
print("\nOne-hot matrisi:", rayon_1hot.shape, "(seyrək:", type(rayon_1hot).__name__ + ")")
print("Sütunlar:", onehot.get_feature_names_out().tolist()[:4], "...")

# 4) Miqyaslama: sahənin paylanması sağa əyilib → əvvəl log, sonra standartlaşdırma
sahe = apartments[["sahe"]].clip(upper=400)  # yazı səhvləri ayrıca düzəldiləcək
for name, values in {
    "min-max": MinMaxScaler().fit_transform(sahe),
    "standart": StandardScaler().fit_transform(sahe),
    "log + standart": StandardScaler().fit_transform(np.log(sahe)),
}.items():
    v = values.ravel()
    skew = pd.Series(v).skew()
    print(f"{name:>15}: min={v.min():6.2f} max={v.max():6.2f} orta={v.mean():5.2f} əyilmə={skew:5.2f}")
