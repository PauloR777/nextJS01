import Link from "next/link";

export default function TeacherPage() {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-semibold mb-2">Teacher Dashboard</h1>
            <p className="text-slate-600"><Link className="text-sky-600 hover:underline" href="/app/student/member">View student submissions</Link></p>
        </div>
    );
}