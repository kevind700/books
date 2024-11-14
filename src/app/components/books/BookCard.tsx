import { Book, BookOpen } from "lucide-react";
import { ProgressBar } from "../shared/ProgressBar";
import { Book as BookType } from "@/types/book";

interface BookCardProps {
  book: BookType;
  onSelect: (book: BookType) => void;
  isLastRead: boolean;
}

export const BookCard = ({ book, onSelect, isLastRead }: BookCardProps) => (
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
        <Book className="text-gray-400 w-6 h-6" />
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
