export interface PageStat {
  readonly page: number;
  time: number;
}

export interface ReadingTime {
  readonly bookId: number;
  readonly title: string;
  timeSpent: number;
  pageStats: PageStat[];
  currentPage: number;
}
