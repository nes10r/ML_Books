"""Məlumat dəstini yükləmək və ona ilk baxış.

baku-apartments.csv faylını Python Lab səhifəsindən endirib bu skriptin
işlədiyi qovluğa qoyun.
"""
import pandas as pd

apartments = pd.read_csv("baku-apartments.csv")

print("Ölçü (sətir, sütun):", apartments.shape)
print(apartments.head(3).to_string())

print("\nSütun tipləri və boş olmayan qiymətlər:")
apartments.info()

print("\nÇatışmayan qiymətlər:")
print(apartments.isna().sum()[lambda s: s > 0].to_string())

print("\nKateqoriyalı sütunlar:")
for col in ["rayon", "tikili", "temir"]:
    print(apartments[col].value_counts(dropna=False).to_string(), "\n")

print("Ədədi xülasə:")
print(apartments[["sahe", "otaq_sayi", "metro_mesafe", "qiymet"]].describe().round(1).to_string())
