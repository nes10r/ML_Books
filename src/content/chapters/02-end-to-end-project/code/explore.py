"""Məlumatın kəşfi: korrelyasiyalar, səhv sətirlər və birləşmiş əlamətlər."""
import pandas as pd
from sklearn.model_selection import train_test_split

apartments = pd.read_csv("baku-apartments.csv")
train, _ = train_test_split(apartments, test_size=0.2, stratify=apartments["rayon"], random_state=42)
df = train.copy()  # kəşfi YALNIZ təlim dəstində aparırıq

numeric = df.select_dtypes("number").drop(columns="id")
print("Qiymət ilə korrelyasiya (təmizləmədən əvvəl):")
print(numeric.corr()["qiymet"].sort_values(ascending=False).round(3).to_string())

# Şübhəli sətirlər: 400 m²-dən böyük "mənzillərin" otaq sayı və qiyməti adi mənzil kimidir
suspicious = df[df["sahe"] > 400]
print(f"\nŞübhəli sahə qiymətləri: {len(suspicious)} sətir")
print(suspicious[["rayon", "sahe", "otaq_sayi", "qiymet"]].to_string())

clean = df.copy()
clean.loc[clean["sahe"] > 400, "sahe"] /= 10  # vergülsüz yazı səhvini düzəldirik: 725 → 72.5
print(f"\nsahe–qiymət korrelyasiyası: əvvəl {df['sahe'].corr(df['qiymet']):.3f}, "
      f"sonra {clean['sahe'].corr(clean['qiymet']):.3f}")

# Birləşmiş əlamətlər
clean["otaq_sahesi"] = clean["sahe"] / clean["otaq_sayi"]
clean["mertebe_nisbeti"] = clean["mertebe"] / clean["bina_mertebe"]
print("\nYeni əlamətlərin qiymət ilə korrelyasiyası:")
print(clean[["sahe", "otaq_sahesi", "mertebe_nisbeti", "metro_mesafe", "qiymet"]]
      .corr()["qiymet"].round(3).to_string())

print("\nRayonlar üzrə 1 m²-in median qiyməti (AZN):")
print((clean["qiymet"] / clean["sahe"]).groupby(clean["rayon"]).median().sort_values().round(0).to_string())
