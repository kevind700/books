"use client";

import Layout from "@/components/layout/layout";
import { useEffect, useState } from "react";
import { BookList } from "./components/books/BookList";
import { BookReader } from "./components/books/BookReader";
import { ReadingStats } from "./components/stats/ReadingStats";
import { Book } from "@/types/book";
import { ReadingTime } from "@/types/stats";
import { calculateTimeSpent, updateStats } from "@/utils/stats";

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [readingStats, setReadingStats] = useState<ReadingTime[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const getUserIdFromCookie = () => {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("token="),
    );
    if (tokenCookie) {
      const token = tokenCookie.split("=")[1].trim();
      setUserId(token);
      return token;
    }
    return null;
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:3001/books");
      const data = (await response.json()) as Book[];

      const currentUserId = getUserIdFromCookie();
      if (!currentUserId) return;

      const savedStats = JSON.parse(
        localStorage.getItem(`readingStats_${currentUserId}`) ?? "[]",
      ) as ReadingTime[];

      const booksWithProgress = data.map((book) => ({
        ...book,
        currentPage:
          savedStats.find((stat) => stat.bookId === book.id)?.currentPage ?? 0,
        lastRead: Date.now(),
      }));

      setBooks(booksWithProgress);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const loadSavedStats = () => {
    const currentUserId = getUserIdFromCookie();
    if (!currentUserId) return;

    const savedStats = localStorage.getItem(`readingStats_${currentUserId}`);
    if (savedStats) {
      setReadingStats(JSON.parse(savedStats));
    }
  };

  useEffect(() => {
    fetchBooks();
    loadSavedStats();
  }, []);

  const updateReadingTime = (book: Book) => {
    if (startTime && userId) {
      const timeSpent = calculateTimeSpent(startTime);
      const newStats = updateStats(readingStats, book, timeSpent, currentPage);
      setReadingStats(newStats);
      localStorage.setItem(`readingStats_${userId}`, JSON.stringify(newStats));

      const updatedBooks = books.map((currentBook) => {
        const isSelectedBook = currentBook.id === book.id;
        if (!isSelectedBook) return currentBook;

        return {
          ...currentBook,
          lastRead: Date.now(),
          currentPage,
        };
      });
      setBooks(updatedBooks);
    }
  };

  const handleSelectBook = (book: Book) => {
    const savedStats = readingStats.find((stat) => stat.bookId === book.id);
    setSelectedBook(book);
    setCurrentPage(book.startPage ?? savedStats?.currentPage ?? 0);
    setStartTime(Date.now());
  };

  const handlePageChange = (direction: "next" | "prev") => {
    if (selectedBook && userId) {
      const newPage = direction === "next" ? currentPage + 1 : currentPage - 1;
      setCurrentPage(newPage);

      const timeSpent = startTime ? calculateTimeSpent(startTime) : 0;
      const newStats = updateStats(
        readingStats,
        selectedBook,
        timeSpent,
        currentPage,
      );
      setReadingStats(newStats);
      localStorage.setItem(`readingStats_${userId}`, JSON.stringify(newStats));
      setStartTime(Date.now());
    }
  };

  const handleCloseReader = () => {
    if (selectedBook) {
      updateReadingTime(selectedBook);
    }
    setSelectedBook(null);
    setCurrentPage(0);
    setStartTime(null);
  };

  return (
    <Layout>
      <div className="p-6">
        {readingStats.length > 0 && (
          <ReadingStats readingStats={readingStats} />
        )}

        <h1 className="text-2xl font-medium mb-6">Libros Disponibles</h1>
        <BookList
          books={books}
          readingStats={readingStats}
          onSelectBook={handleSelectBook}
        />

        {selectedBook && (
          <BookReader
            book={selectedBook}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onClose={handleCloseReader}
          />
        )}
      </div>
    </Layout>
  );
}
