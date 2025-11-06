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

  return options;
}

function displayHelp(): void {
  console.log(`
Использование: word-counter <путь_к_файлу> [опции]

Опции:
  -t, --top     Показать топ-5 самых частых слов

Примеры:
  word-counter document.txt
  word-counter document.txt -t
  `);
}

function main(): void {
  const options = parseArguments();

  if (!options.filePath) {
    console.error('Ошибка: Не указан путь к файлу');
    displayHelp();
    process.exit(1);
  }

  try {
    const result = WordCounter.countWords(options.filePath, options.showTopWords);
    
    console.log(`Общее количество слов: ${result.totalWords}`);
    
    if (options.showTopWords && result.topWords) {
      console.log('\nТоп-5 самых частых слов:');
      result.topWords.forEach((item: { word: string; count: number }, index: number) => {
        console.log(`${index + 1}. "${item.word}" - ${item.count} повтор.`);
      });
    }
  } catch (error) {
    console.error(`Ошибка: ${(error as Error).message}`);
    process.exit(1);
  }
}

main();