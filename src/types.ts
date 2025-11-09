export type TopWordRecord = {
  word: string;
  count: number;
}

export interface WordCountResult {
  totalWords: number;
}

export interface TopWordsResult {
  topWords: TopWordRecord[];
}

export interface CommandLineOptions {
  filePath: string;
  showTopWords: boolean;
}