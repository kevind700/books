import { Book } from "@/types/book";

interface BookReaderProps {
  book: Book;
  currentPage: number;
  onPageChange: (direction: "next" | "prev") => void;
  onClose: () => void;
}

export const BookReader = ({
  book,
  currentPage,
  onPageChange,
  onClose,
}: BookReaderProps) => {
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === book.pages.length - 1;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white/95 backdrop-blur rounded-2xl max-w-4xl w-full mx-4 h-[80vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 flex items-center relative">
          <button
            className="absolute right-4 p-2 hover:bg-gray-100 rounded-full"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
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
