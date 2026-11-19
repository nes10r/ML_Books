"""Son modeli saxlamaq, yenidən yükləmək və yeni mənzil üçün proqnoz vermək."""
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import make_pipeline

from pipeline import AreaTypoFixer, preprocessing  # noqa: F401 — yükləmə üçün sinif mövcud olmalıdır

apartments = pd.read_csv("baku-apartments.csv")
X, y = apartments.drop(columns=["id", "qiymet"]), apartments["qiymet"]

final_model = make_pipeline(
    preprocessing, RandomForestRegressor(n_estimators=100, max_features=8, random_state=42, n_jobs=-1)
)
final_model.fit(X, y)  # yekun model bütün məlumatla öyrədilir
joblib.dump(final_model, "baku_apartment_model.pkl")
print("Model saxlanıldı: baku_apartment_model.pkl")

# ... başqa proses / server tərəfində:
model = joblib.load("baku_apartment_model.pkl")
new_apartment = pd.DataFrame([{
    "rayon": "Yasamal", "enlik": 40.391, "uzunluq": 49.802, "sahe": 85.0, "otaq_sayi": 3,
    "mertebe": 7, "bina_mertebe": 16, "tikili": "yeni", "temir": "əla",
    "metro_mesafe": 0.8, "kupca": 1,
}])
print(f"Proqnoz: {model.predict(new_apartment)[0]:,.0f} AZN")
