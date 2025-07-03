
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

export default function AddFactModal({ isOpen, setIsOpen, user, onSubmit }) {
  const [text, setText]     = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  const chars   = text.length;
  const invalid = chars < 10 || chars > 500;

  const handleSend = async () => {
    if (invalid) return;
    setSubmitting(true);
    try {
      await onSubmit(text.trim());
      setText("");
      setIsOpen(false);
    } catch (e) {
      alert("Failed to submit. Try again.");
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 bg-black/60" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-[#0f172a] p-8 text-white shadow-xl">
            <Dialog.Title className="text-2xl font-bold">Add a Cat Fact</Dialog.Title>
            <p className="text-gray-400 mb-6">
              Share an interesting fact about cats with the community
            </p>

            <div className="mb-6 flex items-center gap-2 bg-gray-800/60 p-4 rounded-lg">
              Logged in as:
              <span className="px-3 py-1 rounded-full bg-gray-100 text-black text-sm">
                {user.role}
              </span>
              <span className="text-gray-400 text-xs">
                ({user.role === "admin" ? "Auto-publishes" : "Needs approval"})
              </span>
            </div>

            {/* textarea */}
            <label className="block font-medium mb-1">Cat Fact</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              placeholder="Enter an interesting fact about cats..."
              className="w-full rounded-lg bg-gray-800 border border-gray-700 p-3 focus:outline-none focus:border-purple-600"
            />

            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{chars}/500 characters</span>
              <span>Minimum 10 characters</span>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                disabled={submitting}
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 rounded-lg border border-gray-500 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                disabled={invalid || submitting}
                onClick={handleSend}
                className={`px-6 py-2 rounded-lg ${
                  invalid || submitting
                    ? "bg-purple-900 text-purple-500 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {submitting ? "Submitting…" : "Submit"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
