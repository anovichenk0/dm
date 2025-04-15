function countFiveLetterWordsBruteForce(word: string): number {
    const letters = word.split('');
    const letterCounts: Record<string, number> = {};

    // Подсчет количества каждой буквы
    for (const letter of letters) {
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    }

    let count = 0;

    // Рекурсивная функция для генерации всех возможных слов
    function generate(currentWord: string, depth: number, availableCounts: Record<string, number>): void {
        if (depth === 5) {
            count++;
            return;
        }

        for (const letter of Object.keys(availableCounts)) {
            if (availableCounts[letter] > 0) {
                availableCounts[letter]--;
                generate(currentWord + letter, depth + 1, availableCounts);
                availableCounts[letter]++; // Восстанавливаем доступность буквы
            }
        }
    }

    generate('', 0, { ...letterCounts });
    return count;
}

// Пример использования
const word = "ЧЕРЕСПОЛОСИЦА";
console.log(`Количество пятибуквенных слов: ${countFiveLetterWordsBruteForce(word)}`);
