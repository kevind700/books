/**
 * @fileoverview Aplicación de lectura de libros con seguimiento de tiempo y estadísticas
 *
 * Este componente implementa un lector de libros con las siguientes características:
 * - Lista de libros disponibles ordenada por tiempo de lectura
 * - Lector de libros con navegación entre páginas
 * - Seguimiento del tiempo de lectura por libro
 * - Estadísticas de lectura visualizadas en gráfico circular
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
 *   timeSpent: 3600000, // milisegundos
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
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Book as BookIcon, BookOpen } from "lucide-react";

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  pages: string[];
  lastRead?: number;
  currentPage?: number;
  startPage?: number;
}

interface ReadingTime {
  bookId: number;
  title: string;
  timeSpent: number;
  currentPage?: number;
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#007AFF",
  },
  mobile: {
    label: "Mobile",
    color: "#5856D6",
  },
} satisfies ChartConfig;

const colors = [
  "#007AFF", // SF Blue
  "#FF3B30", // SF Red
  "#34C759", // SF Green
  "#5856D6", // SF Purple
  "#FF9500", // SF Orange
  "#00C7BE", // SF Teal
  "#FF2D55", // SF Pink
  "#AF52DE", // SF Light Purple
  "#FF6482", // SF Rose
  "#32ADE6", // SF Light Blue
];

const formatStats = (stats: ReadingTime[]) =>
  stats
    .sort((a, b) => b.timeSpent - a.timeSpent)
    .map((stat) => ({
      name: stat.title,
      value: Math.floor(stat.timeSpent / 1000), // Convertir a segundos para mostrar
    }));

const ReadingStats = ({ readingStats }: { readingStats: ReadingTime[] }) => {
  const formattedStats = formatStats(readingStats);
  const totalTime = formattedStats.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="mb-6 p-4 shadow-sm rounded-2xl bg-white/90 backdrop-blur">
      <h2 className="text-xl font-medium mb-4">Estadísticas de Lectura</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <PieChart>
              <Pie
                data={formattedStats}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
              >
                {formattedStats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {`${totalTime}s`}
              </text>
              <Tooltip
                formatter={(value: number, name) => [
                  `Tiempo de lectura: ${value} segundos`,
                  name,
                ]}
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
  const percentage = current ? (current / total) * 100 : 0;

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
        {isLastRead && book.currentPage !== undefined && (
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
      <ProgressBar
        current={book.currentPage || 0}
        total={book.pages.length - 1}
      />
    </div>
  </div>
);

const BookList = ({
  books,
  readingStats,
  onSelectBook,
}: {
  books: Book[];
  readingStats: ReadingTime[];
  onSelectBook: (book: Book) => void;
}) => {
  const booksWithStats = books.map((book) => {
    const stats = readingStats.find((stat) => stat.bookId === book.id);
    return {
      ...book,
      timeSpent: stats?.timeSpent || 0,
      currentPage: stats?.currentPage || book.currentPage || 0,
    };
  });

  // Find the last read book
  const lastReadBook = booksWithStats.reduce(
    (prev, current) =>
      (current.lastRead || 0) > (prev.lastRead || 0) ? current : prev,
    booksWithStats[0],
  );

  // Sort remaining books by time spent
  const otherBooks = booksWithStats
    .filter((book) => book.id !== lastReadBook?.id)
    .sort((a, b) => b.timeSpent - a.timeSpent);

  // Combine with last read book first
  const sortedBooks = lastReadBook ? [lastReadBook, ...otherBooks] : otherBooks;

  return (
    <div className="space-y-4">
      {sortedBooks.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onSelect={onSelectBook}
          isLastRead={!!readingStats.length && book.id === lastReadBook?.id}
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
  Date.now() - startTime; // Devolver milisegundos

const updateStats = (
  currentStats: ReadingTime[],
  book: Book,
  timeSpent: number,
  currentPage: number,
): ReadingTime[] => {
  const newStats = [...currentStats];
  const existingRecord = newStats.find((stat) => stat.bookId === book.id);

  if (existingRecord) {
    existingRecord.timeSpent += timeSpent;
    existingRecord.currentPage = currentPage;
    return newStats;
  }

  return [
    ...newStats,
    {
      bookId: book.id,
      title: book.title,
      timeSpent,
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
      const data = await response.json();

      // Load saved progress from localStorage
      const savedStats = JSON.parse(
        localStorage.getItem("readingStats") || "[]",
      );
      const booksWithProgress = data.map((book: Book) => ({
        ...book,
        currentPage:
          savedStats.find((stat: ReadingTime) => stat.bookId === book.id)
            ?.currentPage || 0,
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

      // Update book's last read time and current page
      const updatedBooks = books.map((b) => {
        if (b.id === book.id) {
          return {
            ...b,
            lastRead: Date.now(),
            currentPage: currentPage,
          };
        }
        return b;
      });
      setBooks(updatedBooks);
    }
  };

  const handleSelectBook = (book: Book) => {
    const savedStats = readingStats.find((stat) => stat.bookId === book.id);
    setSelectedBook(book);
    setCurrentPage(book.startPage || savedStats?.currentPage || 0);
    setStartTime(Date.now());
  };

  const handlePageChange = (direction: "next" | "prev") => {
    if (selectedBook) {
      const newPage = direction === "next" ? currentPage + 1 : currentPage - 1;
      setCurrentPage(newPage);

      // Update stats with new page
      const timeSpent = startTime ? calculateTimeSpent(startTime) : 0;
      const newStats = updateStats(
        readingStats,
        selectedBook,
        timeSpent,
        newPage,
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
