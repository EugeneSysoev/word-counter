import { readFileSync } from 'fs';
import { WordCountResult, TopWordsResult } from './types';

export class WordCounter {  // ✅ Добавляем export
  private static readonly EXCLUDED_WORDS = new Set([
    'не', 'ни', 'но', 'а', 'и', 'или', 'да', 'же', 'ли', 'бы', 'б', 'как',
    'что', 'чтобы', 'чтоб', 'по', 'на', 'за', 'из', 'от', 'до', 'для',
    'при', 'после', 'в', 'с', 'у', 'о', 'об', 'обо', 'ко', 'к', 'со', 'во'
  ]);

  private static wordFrequency: Map<string, number> = new Map();

  public static countWords(filePath: string): WordCountResult {
    if (!filePath.toLowerCase().endsWith('.txt')) {
      throw new Error('Поддерживаются только txt-файлы');
    }

    let content: string;
    try {
      content = readFileSync(filePath, 'utf-8');
    } catch (error) {
      throw new Error(`Не удалось прочитать файл: ${(error as Error).message}`);
    }

    const words = this.processText(content);
    
    this.wordFrequency.clear();
    
    const totalWords = words.reduce((count, word) => {
      if (word && !this.EXCLUDED_WORDS.has(word.toLowerCase())) {
        count++;
        this.wordFrequency.set(word, (this.wordFrequency.get(word) || 0) + 1);
      }
      return count;
    }, 0);

    return { totalWords };
  }

  public static getTopWords(limit: number = 5): TopWordsResult {
    if (this.wordFrequency.size === 0) {
      throw new Error('Сначала необходимо выполнить countWords()');
    }

    const topWords = Array.from(this.wordFrequency.entries())
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, limit)
      .map(([word, count]) => ({ word, count }));

    return { topWords };
  }

  private static processText(text: string): string[] {
    const words = text
      .toLowerCase()
      .split(/[^а-яё-]+/)
      .filter(word => {
        return word.length > 0 && /[а-яё]/.test(word);
      });
    
    return words;
  }
}