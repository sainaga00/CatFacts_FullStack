import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FileText, CheckCircle2, Clock } from "lucide-react";

export default function DashboardModal({ isOpen, setIsOpen, userFacts }) {
  // quick counts
  const total     = userFacts.length;
  const approved  = userFacts.filter(f => f.status === "approved").length;
  const pending   = userFacts.filter(f => f.status === "pending").length;

  const Stat = ({ label, count, icon, color }) => (
    <div className="flex-1 rounded-lg bg-gray-800/50 p-6">
      <div className="flex items-center justify-between text-gray-300">
        <span>{label}</span>
        {icon}
      </div>
      <p className={`mt-4 text-3xl font-bold ${color}`}>{count}</p>
    </div>
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 bg-black/60" />

        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="max-w-3xl w-full h-[90vh] overflow-hidden rounded-2xl bg-[#0f172a] text-white shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <div className="flex items-center gap-2 text-lg font-semibold">
                🛡️ User Dashboard
              </div>
              <button onClick={() => setIsOpen(false)}>✖️</button>
            </div>

            {/* ---- stats row ---- */}
            <div className="flex gap-4 p-6">
              <Stat
                label="Total Submitted"
                count={total}
                icon={<FileText size={18} />}
                color="text-blue-400"
              />
              <Stat
                label="Approved"
                count={approved}
                icon={<CheckCircle2 size={18} />}
                color="text-green-400"
              />
              <Stat
                label="Pending"
                count={pending}
                icon={<Clock size={18} />}
                color="text-yellow-400"
              />
            </div>

            {/* ---- submitted facts ---- */}
            <div className="mx-6 mb-6 flex-1 overflow-y-auto rounded-lg bg-gray-800/40 p-6">
              <h3 className="text-xl font-semibold mb-4">My Submitted Facts</h3>

              {userFacts.length === 0 ? (
                <p className="text-center text-gray-400">No facts submitted yet</p>
              ) : (
                <ul className="space-y-4">
                  {userFacts.map((f, i) => (
                    <li key={i} className="border border-gray-700 rounded p-4">
                      <div className="font-medium">{f.fact}</div>
                      <div className="text-sm text-gray-400 mt-1">{f.date}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
