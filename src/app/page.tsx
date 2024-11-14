"use strict";

/**
 * @fileoverview Aplicación de lectura de libros con seguimiento de tiempo y estadísticas
 *
 * Este componente implementa un lector de libros con las siguientes características:
 * - Lista de libros disponibles ordenada por tiempo de lectura
 * - Lector de libros con navegación entre páginas
 * - Seguimiento del tiempo de lectura por libro
 * - Seguimiento detallado del tiempo por página
 * - Estadísticas de lectura visualizadas en gráficos
 *
 * @example
 * // Ejemplo de uso del componente HomePage
 * <HomePage />
 *
 * // Ejemplo de estructura de libro
 * const libro = {
 *   id: 1,
 *   title: "Don Quijote",
 *   author: "Miguel de Cervantes",
 *   description: "El ingenioso hidalgo...",
 *   pages: ["Página 1...", "Página 2..."]
 * }
 *
 * // Ejemplo de estadística de lectura
 * const estadistica = {
 *   bookId: 1,
 *   title: "Don Quijote",
 *   timeSpent: 3600000, // milisegundos total
 *   pageStats: [{page: 0, time: 1800000}, {page: 1, time: 1800000}], // tiempo por página
 *   currentPage: 1
 * }
 */

"use client";

import Layout from "@/components/layout/layout";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  PieChart,
  ResponsiveContainer,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Book as BookIcon, BookOpen, Clock, ChartPie } from "lucide-react";
import { formatDuration, intervalToDuration } from "date-fns";
import { es } from "date-fns/locale";

interface Book {
  readonly id: number;
  readonly title: string;
  readonly author: string;
  readonly description: string;
  readonly pages: readonly string[];
  lastRead: number;
  currentPage: number;
  startPage?: number;
}

interface PageStat {
  readonly page: number;
  time: number;
}

interface ReadingTime {
  readonly bookId: number;
  readonly title: string;
  timeSpent: number;
  pageStats: PageStat[];
  currentPage: number;
}

type ChartData = {
  readonly name: string;
  readonly value: number;
  readonly pageStats: PageStat[];
};

type PageTimeData = {
  readonly name: string;
  readonly tiempo: number;
};

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#007AFF",
  },
  mobile: {
    label: "Mobile",
    color: "#5856D6",
  },
} as const satisfies ChartConfig;

const colors = [
  "#007AFF",
  "#FF3B30",
  "#34C759",
  "#5856D6",
  "#FF9500",
  "#00C7BE",
  "#FF2D55",
  "#AF52DE",
  "#FF6482",
  "#32ADE6",
] as const;

const formatStats = (stats: readonly ReadingTime[]): ChartData[] =>
  stats
    .toSorted((a, b) => b.timeSpent - a.timeSpent)
    .map((stat) => ({
      name: stat.title,
      value: Math.floor(stat.timeSpent / 1000),
      pageStats: stat.pageStats,
    }));

const ReadingStats = ({
  readingStats,
}: {
  readingStats: readonly ReadingTime[];
}) => {
  const [selectedBook, setSelectedBook] = useState<ReadingTime | null>(null);
  const [selectedBookColor, setSelectedBookColor] = useState<string>(colors[0]);
  const formattedStats = formatStats(readingStats);
  const totalTime = formattedStats.reduce((acc, curr) => acc + curr.value, 0);
  const milliseconds = totalTime * 1000;
  const duration = intervalToDuration({ start: 0, end: milliseconds });

  const pageTimeData: PageTimeData[] =
    selectedBook?.pageStats.map((stat) => ({
      name: `Página ${stat.page + 1}`,
      tiempo: Math.floor(stat.time / 1000),
    })) ?? [];

  return (
    <Card className="mb-6 p-4 shadow-sm rounded-2xl bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Estadísticas de Lectura</h2>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="font-medium">
            Tiempo total: {formatDuration(duration, { locale: es })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={chartConfig}>
              <PieChart>
                <Pie
                  data={formattedStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  onClick={(data, index) => {
                    setSelectedBook(
                      readingStats.find((stat) => stat.title === data.name) ??
                        null,
                    );
                    setSelectedBookColor(colors[index % colors.length]);
                  }}
                >
                  {formattedStats.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name) => {
                    const duration = intervalToDuration({
                      start: 0,
                      end: value * 1000,
                    });
                    return [formatDuration(duration, { locale: es }), name];
                  }}
                  contentStyle={{
                    background: "rgba(255,255,255,0.9)",
                    border: "none",
                    borderRadius: "10px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
              </PieChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>

        <div className="h-[300px] flex flex-col">
          {selectedBook ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pageTimeData}>
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value) => `${Math.floor(value / 60)}m`}
                  label={{
                    value: "Tiempo (minutos)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value: number) => {
                    const duration = intervalToDuration({
                      start: 0,
                      end: value * 1000,
                    });
                    return [
                      formatDuration(duration, { locale: es }),
                      "Tiempo de lectura",
                    ];
                  }}
                />
                <Bar dataKey="tiempo" fill={selectedBookColor} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 p-4">
              <ChartPie className="w-12 h-12 text-gray-400" />
              <p className="text-center">
                Haz clic en alguna sección de la gráfica circular para ver
                estadísticas detalladas del tiempo de lectura por página
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

const ProgressBar = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-[#007AFF] transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const BookCard = ({
  book,
  onSelect,
  isLastRead,
}: {
  book: Book;
  onSelect: (book: Book) => void;
  isLastRead: boolean;
}) => (
  <div
    className={`bg-white/90 backdrop-blur p-4 rounded-lg cursor-pointer hover:shadow-lg transition-all duration-200 border ${
      isLastRead ? "border-[#007AFF] shadow-md" : "border-gray-200"
    } mb-4 flex justify-between items-center`}
    onClick={() => onSelect(book)}
  >
    <div className="flex gap-4 items-center">
      {isLastRead ? (
        <BookOpen className="text-[#007AFF] w-6 h-6" />
      ) : (
        <BookIcon className="text-gray-400 w-6 h-6" />
      )}
      <div>
        <h2 className="text-xl font-medium">{book.title}</h2>
        <p className="text-gray-500">por {book.author}</p>
        {isLastRead && (
          <button
            className="mt-2 text-sm text-[#007AFF] hover:text-[#0051E6]"
            onClick={(e) => {
              e.stopPropagation();
              onSelect({ ...book, startPage: book.currentPage });
            }}
          >
            Continuar leyendo desde página {book.currentPage + 1}
          </button>
        )}
      </div>
    </div>
    <div className="text-right">
      <p className="text-gray-600 mb-2">{book.pages.length} páginas</p>
      <ProgressBar current={book.currentPage} total={book.pages.length - 1} />
    </div>
  </div>
);

const BookList = ({
  books,
  readingStats,
  onSelectBook,
}: {
  books: readonly Book[];
  readingStats: readonly ReadingTime[];
  onSelectBook: (book: Book) => void;
}) => {
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
          isLastRead={book.id === lastReadBook?.id}
        />
      ))}
    </div>
  );
};

const BookReader = ({
  book,
  currentPage,
  onPageChange,
  onClose,
}: {
  book: Book;
  currentPage: number;
  onPageChange: (direction: "next" | "prev") => void;
  onClose: () => void;
}) => {
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === book.pages.length - 1;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white/95 backdrop-blur rounded-2xl max-w-4xl w-full mx-4 h-[80vh] flex flex-col shadow-2xl">
        <div className="p-4 border-b border-gray-200 flex items-center">
          <div
            className="flex space-x-2 absolute left-4"
            onClick={onClose}
            style={{ cursor: "pointer" }}
          >
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
            <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
          </div>
          <div className="flex-1 text-center">
            <h2 className="text-xl font-medium">{book.title}</h2>
            <p className="text-sm text-gray-500">por {book.author}</p>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8 bg-[#FAFAFA]">
          <div className="max-w-2xl mx-auto">
            <p
              className="text-lg leading-relaxed font-['SF Pro Text']"
              style={{
                columnWidth: "300px",
                columnGap: "2rem",
                columnRule: "1px solid #e5e7eb",
              }}
            >
              {book.pages[currentPage]}
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-white/90">
          <button
            className="bg-[#007AFF] text-white px-4 py-2 rounded-md hover:bg-[#0051E6] disabled:opacity-50 transition-colors"
            onClick={() => onPageChange("prev")}
            disabled={isFirstPage}
          >
            Página anterior
          </button>

          <span className="text-gray-600 font-medium">
            Página {currentPage + 1} de {book.pages.length}
          </span>

          <button
            className="bg-[#007AFF] text-white px-4 py-2 rounded-md hover:bg-[#0051E6] disabled:opacity-50 transition-colors"
            onClick={() => onPageChange("next")}
            disabled={isLastPage}
          >
            Siguiente página
          </button>
        </div>
      </div>
    </div>
  );
};

const calculateTimeSpent = (startTime: number): number =>
  Date.now() - startTime;

const updateStats = (
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

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [readingStats, setReadingStats] = useState<ReadingTime[]>([]);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:3001/books");
      const data = (await response.json()) as Book[];

      const savedStats = JSON.parse(
        localStorage.getItem("readingStats") ?? "[]",
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
    const savedStats = localStorage.getItem("readingStats");
    if (savedStats) {
      setReadingStats(JSON.parse(savedStats));
    }
  };

  useEffect(() => {
    fetchBooks();
    loadSavedStats();
  }, []);

  const updateReadingTime = (book: Book) => {
    if (startTime) {
      const timeSpent = calculateTimeSpent(startTime);
      const newStats = updateStats(readingStats, book, timeSpent, currentPage);
      setReadingStats(newStats);
      localStorage.setItem("readingStats", JSON.stringify(newStats));

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
    if (selectedBook) {
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
      localStorage.setItem("readingStats", JSON.stringify(newStats));
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
        <h1 className="text-2xl font-medium mb-6">Libros Disponibles</h1>

        {readingStats.length > 0 && (
          <ReadingStats readingStats={readingStats} />
        )}

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
