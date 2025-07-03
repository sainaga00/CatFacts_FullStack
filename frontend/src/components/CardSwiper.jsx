import { useState, useEffect } from "react";
import { CalendarDays, User, Shuffle, RotateCcw } from "lucide-react";

export default function CardSwiper({ facts = [] }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [shuffledFacts, setShuffledFacts] = useState([]);

  useEffect(() => {
    setShuffledFacts([...facts]); // copy incoming facts to local state
  }, [facts]);

  if (!shuffledFacts.length) {
    return (
      <p className="text-center text-white/70 mt-10">
        No approved cat facts yet 🐾
      </p>
    );
  }

  const total = shuffledFacts.length;
  const current = shuffledFacts[index];

  const next = () => {
    setIndex((i) => (i + 1) % total);
    setRevealed(false);
  };

  const prev = () => {
    setIndex((i) => (i - 1 + total) % total);
    setRevealed(false);
  };

  const reset = () => {
    setIndex(0);
    setRevealed(false);
    setShuffledFacts([...facts]); // reset to original order
  };

  const shuffle = () => {
    const copy = [...shuffledFacts];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setShuffledFacts(copy);
    setIndex(0);
    setRevealed(false);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center justify-between w-full max-w-lg mb-4">
        <span className="bg-white text-black/80 px-4 py-1 rounded-full text-sm shadow">
          Card {index + 1} of {total}
        </span>
        <div className="flex gap-2">
          <button onClick={shuffle} className="bg-white p-2 rounded shadow">
            <Shuffle size={18} className="text-purple-600" />
          </button>
          <button onClick={reset} className="bg-white p-2 rounded shadow">
            <RotateCcw size={18} className="text-pink-500" />
          </button>
        </div>
      </div>

      <div className="relative w-full max-w-lg h-2 bg-white/30 rounded-full mb-8">
        <div
          className="absolute h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-300"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <div
        key={current.id}
      className="bg-gradient-to-br  via-[#FADCD9] to-teal-500 text-black w-full max-w-lg p-10 rounded-3xl shadow-xl text-center animate-fade-in border border-white"
      >
        <div className="uppercase tracking-wide text-xs font-semibold mb-4">
          
        </div>

        <h2 className="text-2xl font-bold mb-8">{current.fact}</h2>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="bg-white/20 text-black px-6 py-2 rounded-full hover:bg-white/30"
          >
            Click for Details
          </button>
        ) : (
          <div className="text-lg font-medium flex flex-col gap-2 items-center">
            <span className="inline-flex items-center gap-1">
              <CalendarDays size={16} /> {current.date}
            </span>
            <span className="inline-flex items-center gap-1">
              <User size={16} /> {current.author}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-6 mt-10">
        <button
          onClick={prev}
          className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-2 text-white rounded-lg shadow hover:opacity-90"
        >
          ← Previous
        </button>
        <button
          onClick={next}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-2 text-white rounded-lg shadow hover:opacity-90"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
