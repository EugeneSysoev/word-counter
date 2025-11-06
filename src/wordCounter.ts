import { readFileSync } from 'fs';
import { WordCountResult } from './types';

export class WordCounter {
  private static readonly EXCLUDED_WORDS = new Set([
    'не', 'ни', 'но', 'а', 'и', 'или', 'да', 'же', 'ли', 'бы', 'б', 'как',
    'что', 'чтобы', 'чтоб', 'по', 'на', 'за', 'из', 'от', 'до', 'для',
    'при', 'после', 'в', 'с', 'у', 'о', 'об', 'обо', 'ко', 'к', 'со', 'во'
  ]);

  public static countWords(filePath: string, showTopWords: boolean = false): WordCountResult {
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
    const wordFrequency = new Map<string, number>();

    let totalWords = 0;

    for (const word of words) {
      if (word && !this.EXCLUDED_WORDS.has(word.toLowerCase())) {
        totalWords++;
        wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
      }
    }

    const result: WordCountResult = { totalWords };

    if (showTopWords) {
      result.topWords = this.getTopWords(wordFrequency, 5);
    }

    return result;
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

  private static getTopWords(
    wordFrequency: Map<string, number>, 
    limit: number
  ): Array<{ word: string; count: number }> {
    return Array.from(wordFrequency.entries())
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, limit)
      .map(([word, count]) => ({ word, count }));
  }
}