import { ReadingTime } from "@/types/stats";
import { Book } from "@/types/book";

export const calculateTimeSpent = (startTime: number): number =>
  Date.now() - startTime;

export const updateStats = (
  currentStats: ReadingTime[],
  book: Book,
  timeSpent: number,
  currentPage: number,
): ReadingTime[] => {
  const newStats = [...currentStats];
  const existingRecord = newStats.find((stat) => stat.bookId === book.id);

  if (existingRecord) {
    const existingPageStat = existingRecord.pageStats.find(
      (ps) => ps.page === currentPage,
    );
    if (existingPageStat) {
      existingPageStat.time += timeSpent;
    } else {
      existingRecord.pageStats.push({ page: currentPage, time: timeSpent });
    }

    existingRecord.timeSpent = existingRecord.pageStats.reduce(
      (sum, ps) => sum + ps.time,
      0,
    );
    existingRecord.currentPage = currentPage;
    return newStats;
  }

  return [
    ...newStats,
    {
      bookId: book.id,
      title: book.title,
      timeSpent,
      pageStats: [{ page: currentPage, time: timeSpent }],
      currentPage,
    },
  ];
};
