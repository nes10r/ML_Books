"""İkili təsnifatçı: "bu rəqəm 5-dirmi?" və dəqiqliyin tələsi."""
import numpy as np
from sklearn.datasets import load_digits
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import SGDClassifier
from sklearn.model_selection import cross_val_score, train_test_split

X, y = load_digits(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

y_train_5 = y_train == 5  # True: 5, False: digər rəqəmlər
print(f"Təlim dəstində 5-lərin payı: {y_train_5.mean():.1%}")

sgd_clf = SGDClassifier(random_state=42)
sgd_clf.fit(X_train, y_train_5)
print("İlk 5 şəklin proqnozu:", sgd_clf.predict(X_train[:5]), "| həqiqət:", y_train_5[:5])

acc = cross_val_score(sgd_clf, X_train, y_train_5, cv=3, scoring="accuracy")
print("SGD dəqiqliyi (3 qat):", np.round(acc, 3))

# Heç nə öyrənməyən "model": həmişə ən çox rast gələn sinfi (False) proqnozlaşdırır
dummy = DummyClassifier(strategy="most_frequent")
dummy_acc = cross_val_score(dummy, X_train, y_train_5, cv=3, scoring="accuracy")
print("Dummy dəqiqliyi (3 qat):", np.round(dummy_acc, 3))
