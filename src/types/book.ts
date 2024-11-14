export interface Book {
  readonly id: number;
  readonly title: string;
  readonly author: string;
  readonly description: string;
  readonly pages: readonly string[];
  lastRead: number;
  currentPage: number;
  startPage?: number;
}
