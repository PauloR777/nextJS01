"use client";
import useUserMembers from "../store";
import Link from "next/link";
import Image from "next/image";
import { use } from "react";

type Props = { params: Promise<{ id: string }> };

export default function MemberDetail({ params }: Props) {
  const { id } = use(params);
  const member = useUserMembers((s) => s.members.find((m) => m.id === id));

  if (!member) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-slate-600">ไม่พบข้อมูลผู้สมัคร</p>
        <Link href="/app/teacher/member" className="mt-4 inline-block text-sky-600 hover:underline">
          ← กลับไปหน้ารายชื่อ
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <Link href="/app/teacher/member" className="text-sky-600 hover:underline">
          ← กลับไปหน้ารายชื่อ
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {member.profilePhoto && (
          <div className="w-full md:w-1/3">
            <Image
              src={member.profilePhoto}
              alt="รูปโปรไฟล์"
              width={300}
              height={400}
              className="w-full rounded-lg shadow-sm"
              unoptimized
            />
          </div>
        )}
        
        <div className="flex-1">
          <h1 className="text-black text-2xl font-semibold mb-4">{member.firstName} {member.lastName}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-slate-500">โรงเรียน</h3>
              <p className="text-indigo-900 text-lg">{member.school}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500">GPA</h3>
              <p className="text-indigo-900 text-lg">{member.gpa}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500">สาขาที่เลือก</h3>
              <p className="text-indigo-900 text-lg">{member.major}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500">มหาวิทยาลัย</h3>
              <p className="text-indigo-900 text-lg">{member.university}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-slate-500">ที่อยู่</h3>
              <p className="text-indigo-900 mt-1">{member.address}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500">เบอร์โทรศัพท์</h3>
              <p className="text-indigo-900 mt-1">{member.phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500">ความสามารถพิเศษ</h3>
              <p className="text-indigo-900 mt-1">{member.skills}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500">เหตุผลในการสมัคร</h3>
              <p className="text-indigo-900 mt-1">{member.reason}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Gallery */}
      {member.activities && member.activities.length > 0 && (
        <div className="mt-4">
          <h2 className="text-black text-xl font-semibold mb-4">กิจกรรมที่เคยทำ</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {member.activities.map((url, idx) => (
              <Image
                key={idx}
                src={url}
                alt={`Activity ${idx + 1}`}
                width={200}
                height={192}
                className="w-full h-48 object-cover rounded-lg shadow-sm"
                unoptimized
              />
            ))}
          </div>
        </div>
      )}

      {/* Awards Gallery */}
      {member.awards && member.awards.length > 0 && (
        <div className="mt-4">
          <h2 className="text-black text-xl font-semibold mb-4">รางวัลที่เคยได้รับ</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {member.awards.map((url, idx) => (
              <Image
                key={idx}
                src={url}
                alt={`Award ${idx + 1}`}
                width={200}
                height={192}
                className="w-full h-48 object-cover rounded-lg shadow-sm"
                unoptimized
              />
            ))}
          </div>
        </div>
      )}

      {/* Works Gallery */}
      {member.works && member.works.length > 0 && (
        <div className="mt-4">
          <h2 className="text-black text-xl font-semibold mb-4">ผลงานอื่นๆ</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {member.works.map((url, idx) => (
              <Image
                key={idx}
                src={url}
                alt={`Work ${idx + 1}`}
                width={200}
                height={192}
                className="w-full h-48 object-cover rounded-lg shadow-sm"
                unoptimized
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
