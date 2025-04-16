from sympy import symbols, series

# Определяем переменную
t = symbols('t')

# Порождающая функция
numerator = 1 + 2*t - 9*t**2 + 3*t**3 / (1 - t)
denominator = 1 - 2*t - 5*t**2 + 6*t**3
G = numerator / denominator

# Разложение в ряд до t^10
series_expansion = series(G, t, 0, 11).removeO()

# Коэффициент при t^10
coefficient_t10 = series_expansion.coeff(t, 10)
print("Коэффициент при t^10:", coefficient_t10)