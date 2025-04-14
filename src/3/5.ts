type SymbolProbabilities = { [key: string]: number };

function arithmeticCoding(input: string, probabilities: SymbolProbabilities): { binaryString: string, interval: [number, number] } {
    // Сортируем символы по их вероятностям
    const symbols = Object.keys(probabilities).sort();
    const cumulativeProbabilities: { [key: string]: [number, number] } = {};

    // Вычисляем кумулятивные вероятности
    let cumulative = 0;
    for (const symbol of symbols) {
        const prob = probabilities[symbol];
        cumulativeProbabilities[symbol] = [cumulative, cumulative + prob];
        cumulative += prob;
    }

    // Инициализация начального интервала
    let low = 0;
    let high = 1;

    // Проходим по каждому символу строки
    for (const char of input) {
        const range = high - low;
        const [charLow, charHigh] = cumulativeProbabilities[char];

        high = low + range * charHigh;
        low = low + range * charLow;
    }

    // Преобразуем интервал в двоичную строку
    const binaryString = toBinary(low, high);
    return { binaryString, interval: [low, high] };
}

function toBinary(low: number, high: number): string {
    let binary = '';
    let value = 0;
    let bit = 0.5;

    while (true) {
        if (value + bit <= low) {
            binary += '1';
            value += bit;
        } else if (value + bit >= high) {
            binary += '0';
        } else {
            binary += '1';
            value += bit;
        }
        bit /= 2;

        if (value >= low && value < high) {
            break;
        }
    }

    return binary;
}

// Пример использования
const probabilities: SymbolProbabilities = {
    a: 0.05,
    b: 0.10,
    c: 0.05,
    d: 0.55,
    e: 0.15,
    f: 0.10
};

const input = "eacdbf";
const result = arithmeticCoding(input, probabilities);

console.log("Двоичная строка:", result.binaryString);
console.log("Интервал:", result.interval);

// Вычисление степени сжатия и коэффициента сжатия
const originalBits = input.length * 3; // Равномерное кодирование (3 бита на символ)
const compressedBits = result.binaryString.length;
const compressionRatio = originalBits / compressedBits;
const compressionDegree = 1 - (compressedBits / originalBits);

console.log({ originalBits, compressedBits })
console.log("Степень сжатия:", compressionDegree.toFixed(2));
console.log("Коэффициент сжатия:", compressionRatio.toFixed(2));