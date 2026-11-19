"""Xüsusi transformer + ColumnTransformer + Pipeline: bütün hazırlıq bir obyektdə."""
import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import FunctionTransformer, OneHotEncoder, OrdinalEncoder, StandardScaler


class AreaTypoFixer(BaseEstimator, TransformerMixin):
    """Sahəsi `max_area`-dan böyük olan qiymətləri 10-a bölür (vergülsüz yazı səhvi)."""

    def __init__(self, max_area=400.0):
        self.max_area = max_area

    def fit(self, X, y=None):
        self.n_features_in_ = X.shape[1]
        return self  # öyrəniləcək heç nə yoxdur

    def transform(self, X):
        X = np.asarray(X, dtype=float).copy()
        X[X > self.max_area] /= 10
        return X

    def get_feature_names_out(self, names=None):
        return np.asarray(names)


def column_ratio(X):
    """Birinci sütunun ikinciyə nisbəti. Lambda deyil, adlı funksiya: joblib ilə saxlanıla bilsin."""
    return X[:, [0]] / X[:, [1]]


def ratio_name(transformer, names):
    return ["nisbet"]


def ratio_pipeline():
    """İki sütunun nisbəti (məs. mərtəbə / bina mərtəbəsi) → standartlaşdırma."""
    return make_pipeline(
        SimpleImputer(strategy="median"),
        FunctionTransformer(column_ratio, feature_names_out=ratio_name),
        StandardScaler(),
    )


area_pipeline = make_pipeline(
    AreaTypoFixer(),
    FunctionTransformer(np.log, inverse_func=np.exp, feature_names_out="one-to-one"),
    StandardScaler(),
)
num_pipeline = make_pipeline(SimpleImputer(strategy="median"), StandardScaler())
temir_pipeline = make_pipeline(
    SimpleImputer(strategy="most_frequent"),
    OrdinalEncoder(categories=[["təmirsiz", "orta", "əla"]]),
)
cat_pipeline = make_pipeline(SimpleImputer(strategy="most_frequent"), OneHotEncoder(handle_unknown="ignore"))

preprocessing = ColumnTransformer(
    [
        ("sahe", area_pipeline, ["sahe"]),
        ("mertebe_nisbeti", ratio_pipeline(), ["mertebe", "bina_mertebe"]),
        ("say", num_pipeline, ["otaq_sayi", "metro_mesafe", "enlik", "uzunluq"]),
        ("temir", temir_pipeline, ["temir"]),
        ("kateqoriya", cat_pipeline, ["rayon", "tikili"]),
    ],
    remainder="passthrough",  # kupca (0/1) olduğu kimi keçir
)

if __name__ == "__main__":
    apartments = pd.read_csv("baku-apartments.csv")
    X = apartments.drop(columns=["id", "qiymet"])
    X_prepared = preprocessing.fit_transform(X)
    print("Hazırlanmış matris:", X_prepared.shape)
    print("Əlamət adları:")
    for name in preprocessing.get_feature_names_out():
        print("  ", name)
