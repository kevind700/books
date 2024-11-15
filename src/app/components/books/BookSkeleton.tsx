export const BookSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-white rounded-lg items-center shadow-md p-4 flex flex-col md:flex-row gap-4"
        >
          <div className="w-full md:w-[24px] h-[24px] bg-gray-200 rounded-md flex-shrink-0" />

          <div className="flex-grow space-y-4">
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded md:w-52 w-full" />
            </div>

            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded md:w-32 w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
