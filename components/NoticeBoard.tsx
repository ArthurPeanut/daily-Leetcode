// components/NoticeBoard.tsx
export default function NoticeBoard() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">📌 Notice Board</h2>
      <ul className="space-y-2 text-gray-900 text-sm">
        <li>🗓️ Currently on a 9-day Leetcode streak</li>
        <li>🧠 Focus: <strong>Data Analysis</strong> & <strong>Paper Writing</strong></li>
        <li>🔥 Goals: daily Leetcode, paper writing, and online assessments</li>
        <li>🚀 Paper status: <strong>Data Collection</strong> completed</li>
      </ul>

        {/* 🐹 Cute gif */}
      <img
        src="/Images/rabbit.gif"
        alt="After work"
        className="w-40 mt-4 rounded"
      />
    </div>
  );
}
