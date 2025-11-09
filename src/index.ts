#!/usr/bin/env node

import { WordCounter } from './wordCounter';
import { CommandLineOptions } from './types';

function parseArguments(): CommandLineOptions {
  const args = process.argv.slice(2);
  const options: CommandLineOptions = {
    filePath: '',
    showTopWords: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '-t' || arg === '--top') {
      options.showTopWords = true;
    } else if (!arg.startsWith('-')) {
      options.filePath = arg;
    }
  }

  if (!options.filePath) {
    console.error('Ошибка: Не указан путь к файлу');
    displayHelp();
    process.exit(1);
  }

  return options;
}

function displayHelp(): void {
  console.log(`
Word Counter - утилита для подсчета слов в текстовых файлах

Использование:
  npm start -- <путь_к_файлу> [опции]
  node dist/index.js <путь_к_файлу> [опции]

Опции:
  -t, --top     Показать топ-5 самых частых слов

Примеры:
  npm start -- document.txt          # Базовый подсчет слов
  npm start -- document.txt -t       # Подсчет с выводом топа слов
  node dist/index.js text.txt        # Прямой запуск
  node dist/index.js text.txt --top  # Прямой запуск с топом слов

Создание тестового файла:
  echo "Ваш текст здесь" > document.txt
  `);
}

function main(): void {
  const options = parseArguments();

  try {
    // Основной подсчет слов
    const result = WordCounter.countWords(options.filePath);
    console.log(`Общее количество слов: ${result.totalWords}`);
    
    // Отдельный вызов для топа слов (только если нужен)
    if (options.showTopWords) {
      const topWordsResult = WordCounter.getTopWords({
        filePath: options.filePath,
        limit: 5
      });
      
      console.log('\nТоп-5 самых частых слов:');
      topWordsResult.topWords.forEach((item, index) => {
        console.log(`${index + 1}. "${item.word}" - ${item.count} повтор.`);
      });
    }
  } catch (error) {
    console.error(`Ошибка: ${(error as Error).message}`);
    process.exit(1);
  }
}

main();