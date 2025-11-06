Word Counter
Консольная утилита для подсчета слов в текстовых файлах.

Функциональность
Подсчет общего количества слов в txt-файлах
Игнорирование знаков препинания
Исключение союзов и частицы "не"
Слова с дефисами считаются как одно слово
Вывод топ-5 самых частых слов по флагу -t

Установка
bash
git clone <repository-url>
cd word-counter
npm install
Сборка
bash
npm run build
Использование
bash

# Базовое использование
word-counter document.txt

# С выводом топ-5 слов
word-counter document.txt -t

# Сборка и запуск
npm run dev

# Проверка кода
npm run lint

# Автоисправление ошибок
npm run lint:fix

# Сборка проекта
npm run build