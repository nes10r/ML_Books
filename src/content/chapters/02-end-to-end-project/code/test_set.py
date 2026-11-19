"""Test dəstinin üç üsulla yaradılması və müqayisəsi."""
from zlib import crc32

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

apartments = pd.read_csv("baku-apartments.csv")

# 1) Təsadüfi bölgü — sadə, lakin hər işə salmada eyni qalması üçün random_state lazımdır
train_rand, test_rand = train_test_split(apartments, test_size=0.2, random_state=42)


# 2) ID-yə əsaslanan sabit bölgü — yeni sətirlər əlavə olunanda köhnələr yerində qalır
def is_in_test(identifier: int, test_ratio: float) -> bool:
    return crc32(np.int64(identifier)) < test_ratio * 2**32


in_test = apartments["id"].apply(is_in_test, test_ratio=0.2)
test_hash = apartments[in_test]

# 3) Stratifikasiyalı bölgü — hər rayonun payı test dəstində də qorunur
train_strat, test_strat = train_test_split(
    apartments, test_size=0.2, stratify=apartments["rayon"], random_state=42
)

overall = apartments["rayon"].value_counts(normalize=True)
compare = pd.DataFrame(
    {
        "ümumi %": overall,
        "təsadüfi %": test_rand["rayon"].value_counts(normalize=True),
        "stratifik %": test_strat["rayon"].value_counts(normalize=True),
    }
).mul(100).round(2)
compare["təsadüfi xəta"] = (compare["təsadüfi %"] - compare["ümumi %"]).abs().round(2)
compare["stratifik xəta"] = (compare["stratifik %"] - compare["ümumi %"]).abs().round(2)
print(compare.to_string())
print(f"\nHash bölgüsündə test ölçüsü: {len(test_hash)} ({len(test_hash) / len(apartments):.1%})")
