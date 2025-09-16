import Link from "next/link";

export function Navbar() {
  return (
    <nav>
      <ul className="flex items-center gap-4">
        <li>
          <Link href="/app/student/form" className="text-slate-700 hover:text-sky-600">Portfolio Form</Link>
        </li>
        <li>
          <Link href="/app/teacher/member" className="text-slate-700 hover:text-sky-600">Teacher</Link>
        </li>
      </ul>
    </nav>
  );
}
