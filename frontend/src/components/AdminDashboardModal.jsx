import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { BarChart3, CheckCircle2, Clock, Shield } from "lucide-react";

export default function AdminDashboardModal({
  isOpen,
  setIsOpen,
  facts,
  onApprove,
  onReject,
}) {
  /* ───────── derived stats ───────── */
  const total        = facts.length;
  const approved     = facts.filter(f => f.status === "approved").length;
  const pendingList  = facts.filter(f => f.status === "pending");
  const contributors = new Set(facts.map(f => f.author)).size;

  const Stat = ({ label, count, icon }) => (
    <div className="flex-1 rounded-lg bg-gray-800/50 p-6">
      <div className="flex items-center justify-between text-gray-300">
        <span>{label}</span>
        {icon}
      </div>
      <p className="mt-4 text-3xl font-bold">{count}</p>
    </div>
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 bg-black/60" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="max-w-4xl w-full h-[90vh] overflow-hidden rounded-2xl bg-[#0f172a] text-white shadow-xl">
            {/* ─── Header ─── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <div className="flex items-center gap-2 text-lg font-semibold">
                🛡️ Admin Dashboard
              </div>
              <button onClick={() => setIsOpen(false)}>✖️</button>
            </div>

            {/* ─── Stats Row ─── */}
            <div className="flex gap-4 p-6">
              <Stat label="Total Facts"  count={total}   icon={<BarChart3 size={18} className="text-purple-400" />} />
              <Stat label="Approved"     count={approved} icon={<CheckCircle2 size={18} className="text-green-400" />} />
              <Stat label="Pending Review" count={pendingList.length} icon={<Clock size={18} className="text-yellow-400" />} />
              <Stat label="Contributors" count={contributors} icon={<Shield size={18} className="text-blue-400" />} />
            </div>

            {/* ─── Pending Review List ─── */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <h3 className="text-2xl font-semibold mb-4">
                🕑 Facts Pending Review ({pendingList.length})
              </h3>

              {pendingList.length === 0 ? (
                <p className="text-center text-gray-400">No pending submissions 🎉</p>
              ) : (
                <div className="space-y-6">
                  {pendingList.map((f, idx) => (
                    <div
                      key={idx}
                      className="border border-yellow-500/30 rounded-lg p-6 bg-gray-800/40"
                    >
                      <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
                        <span className="bg-gray-100 text-black px-2 py-1 rounded-full text-xs font-medium">
                          Pending Review
                        </span>
                        <span>{f.date}</span>
                      </div>

                      <p className="mb-4 whitespace-pre-wrap">{f.fact}</p>

                      <div className="flex gap-4">
                        <button
                          onClick={() => onApprove(f)}
                          className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => onReject(f)}
                          className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
