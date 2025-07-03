import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

export default function LoginModal({ isOpen, setIsOpen, onLogin }) {
  const [userType, setUserType] = useState('user')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    if (username && password) {
      onLogin(userType, username)
      setIsOpen(false)
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto flex items-center justify-center">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#0f172a] p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-white">
              Login to Add Cat Facts
            </Dialog.Title>
            <p className="mt-1 text-sm text-gray-400">Choose your login type to continue</p>

            <div className="mt-4 flex gap-2">
              <button
                className={`flex-1 py-2 rounded-lg ${
                  userType === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400'
                }`}
                onClick={() => setUserType('user')}
              >
                🧑‍💻 User
              </button>
              <button
                className={`flex-1 py-2 rounded-lg ${
                  userType === 'admin'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400'
                }`}
                onClick={() => setUserType('admin')}
              >
                🛡️ Admin
              </button>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-white">Username</label>
              <input
                className="w-full mt-1 px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-700"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
              />
              <label className="text-sm font-medium text-white mt-4 block">Password</label>
              <input
                type="password"
                className="w-full mt-1 px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-700"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>

            <button
              className="mt-6 w-full py-2 bg-purple-600 text-white rounded-lg"
              onClick={handleLogin}
            >
              Login as {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </button>
            <p className="text-sm text-center text-gray-500 mt-2">
              Demo: Use any username/password
            </p>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  )
}
