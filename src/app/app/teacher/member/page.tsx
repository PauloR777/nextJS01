"use client";
import Link from "next/link";
import useUserMembers from "./store";

export default function MemberList() {
  const members = useUserMembers((s) => s.members);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-black text-2xl font-semibold mb-6">รายชื่อผู้สมัคร TCAS69</h1>
      {members.length === 0 ? (
        <p className="text-slate-600">ยังไม่มีผู้สมัคร</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-black text-left px-4 py-2 border-b">ชื่อ-นามสกุล</th>
                <th className="text-black text-left px-4 py-2 border-b">GPA</th>
                <th className="text-black text-left px-4 py-2 border-b">โรงเรียน</th>
                <th className="text-black text-left px-4 py-2 border-b">สาขา</th>
                <th className="text-black text-left px-4 py-2 border-b">มหาวิทยาลัย</th>
                <th className="text-black text-center px-4 py-2 border-b">รายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="text-indigo-900 px-4 py-3 border-b font-medium">{m.firstName} {m.lastName}</td>
                  <td className="text-indigo-900 px-4 py-3 border-b">{m.gpa}</td>
                  <td className="text-indigo-900 px-4 py-3 border-b">{m.school}</td>
                  <td className="text-indigo-900 px-4 py-3 border-b">{m.major}</td>
                  <td className="text-indigo-900 px-4 py-3 border-b">{m.university}</td>
                  <td className="text-indigo-900 px-4 py-3 border-b text-center">
                    <Link 
                      href={`/app/teacher/member/${m.id}`}
                      className="inline-flex items-center justify-center px-4 py-1 bg-sky-100 text-sky-700 rounded-full hover:bg-sky-200"
                    >
                      ดูข้อมูล
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
