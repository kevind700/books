"use client";

import { BookCard } from "./BookCard";
import { Book } from "@/types/book";
import { ReadingTime } from "@/types/stats";

interface BookListProps {
  books: readonly Book[];
  readingStats: readonly ReadingTime[];
  onSelectBook: (book: Book) => void;
}

export const BookList = ({
  books,
  readingStats,
  onSelectBook,
}: BookListProps) => {
  const hasReadingStats = readingStats.length > 0;
  const booksWithStats = books.map((book) => {
    const stats = readingStats.find((stat) => stat.bookId === book.id);
    return {
      ...book,
      timeSpent: stats?.timeSpent ?? 0,
      currentPage: stats?.currentPage ?? book.currentPage,
    };
  });

  const lastReadBook = booksWithStats.reduce(
    (prev, current) => (current.lastRead > prev.lastRead ? current : prev),
    booksWithStats[0],
  );

  const otherBooks = booksWithStats
    .filter((book) => book.id !== lastReadBook?.id)
    .sort((a, b) => b.timeSpent - a.timeSpent);

  const sortedBooks = lastReadBook ? [lastReadBook, ...otherBooks] : otherBooks;

  return (
    <div className="space-y-4">
      {sortedBooks.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onSelect={onSelectBook}
          isLastRead={hasReadingStats && book.id === lastReadBook?.id}
        />
      ))}
    </div>
  );
};
