import Link from 'next/link';

export default function ChatDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center text-white">
          <h1 className="mb-4 text-5xl font-bold">Real-time Chat Demo</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* User 1 Card */}
          <Link href="/chat-demo/user1">
            <div className="group cursor-pointer rounded-xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500 text-3xl font-bold text-white">
                U1
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-800">User 1</h2>
              <p className="mb-4 text-gray-600">
                Mở cửa sổ này để chat với Admin
              </p>
              <div className="flex items-center gap-2 text-blue-500 font-semibold group-hover:gap-3 transition-all">
                <span>Mở Chat</span>
                <span>→</span>
              </div>
            </div>
          </Link>

          {/* User 2 Card */}
          <Link href="/chat-demo/user2">
            <div className="group cursor-pointer rounded-xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-3xl font-bold text-white">
                U2
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-800">User 2</h2>
              <p className="mb-4 text-gray-600">
                Mở cửa sổ này để chat với Admin
              </p>
              <div className="flex items-center gap-2 text-green-500 font-semibold group-hover:gap-3 transition-all">
                <span>Mở Chat</span>
                <span>→</span>
              </div>
            </div>
          </Link>

          {/* Admin Card */}
          <Link href="/chat-demo/admin">
            <div className="group cursor-pointer rounded-xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-500 text-3xl font-bold text-white">
                A
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-800">Admin</h2>
              <p className="mb-4 text-gray-600">
                Quản lý và trả lời tin nhắn từ users
              </p>
              <div className="flex items-center gap-2 text-purple-500 font-semibold group-hover:gap-3 transition-all">
                <span>Mở Panel</span>
                <span>→</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}