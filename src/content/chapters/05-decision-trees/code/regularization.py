"""Requlyarlaşdırma hiperparametrləri: məhdudiyyətsiz və məhdudlaşdırılmış ağaclar."""
from sklearn.datasets import make_moons
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.tree import DecisionTreeClassifier

X, y = make_moons(n_samples=300, noise=0.3, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

models = {
    "məhdudiyyətsiz": DecisionTreeClassifier(random_state=42),
    "min_samples_leaf=8": DecisionTreeClassifier(min_samples_leaf=8, random_state=42),
    "max_depth=4": DecisionTreeClassifier(max_depth=4, random_state=42),
}
print(f"{'model':<20} {'dərinlik':>8} {'yarpaq':>7} {'təlim':>7} {'test':>7}")
for name, m in models.items():
    m.fit(X_train, y_train)
    print(f"{name:<20} {m.get_depth():>8} {m.get_n_leaves():>7} "
          f"{m.score(X_train, y_train):>7.3f} {m.score(X_test, y_test):>7.3f}")

grid = GridSearchCV(
    DecisionTreeClassifier(random_state=42),
    {"max_depth": [2, 3, 4, 6, 8, None], "min_samples_leaf": [1, 3, 5, 8, 12, 20]},
    cv=5,
)
grid.fit(X_train, y_train)
print(f"\nGridSearchCV ən yaxşı: {grid.best_params_}, CV dəqiqliyi = {grid.best_score_:.3f}, "
      f"test = {grid.score(X_test, y_test):.3f}")
