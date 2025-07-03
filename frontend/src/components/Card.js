import { CalendarDays, User, Hash } from "lucide-react";
export default function Card({ id, title, fact, date, author }) {
  return (
    <div className="bg-purple-800/30 rounded-xl p-5 text-white shadow-md backdrop-blur border border-purple-600">
      {/* Top section: Title + ID + Date */}
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex flex-col text-xs text-purple-200 items-end">
          <span className="flex items-center gap-1 bg-gray-900/80 px-2 py-1 rounded-full mb-1">
            <Hash size={12} />
            ID: {id}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays size={14} />
            {date}
          </span>
        </div>
      </div>

      {/* Fact Body */}
      <p className="text-sm mb-4 whitespace-pre-wrap">{fact}</p>

      {/* Footer */}
      <div className="flex justify-end text-sm text-purple-300">
        <span className="flex items-center gap-1">
          <User size={16} />
          {author}
        </span>
      </div>
    </div>
  );
}
