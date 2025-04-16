function calculateTenthTerm(): number {
    const A = 2, B = 5, C = -6, D = 3;
    const x = [1, 4, 4]; // начальные значения x(0), x(1), x(2)

    for (let n = 3; n <= 10; n++) {
        x[n] = A * x[n - 1] + B * x[n - 2] + C * x[n - 3] + D;
    }

    return x[10];
}

// Пример вызова функции
console.log(calculateTenthTerm());

// Через порождающую функцию