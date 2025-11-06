export interface WordCountResult {
  totalWords: number;
  topWords?: Array<{
    word: string;
    count: number;
  }>;
}

export interface CommandLineOptions {
  filePath: string;
  showTopWords: boolean;
}