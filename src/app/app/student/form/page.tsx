"use client";
// Todolist.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import useUserMembers from "../../teacher/member/store";

// Note: schema/types moved inside the client component to avoid using DOM globals (FileList) during SSR

export default function TodoApp() {
  // Portfolio schema
  const TaskSchema = z.object({
    firstName: z.string().trim().min(1, "กรุณากรอกชื่อ"),
    lastName: z.string().trim().min(1, "กรุณากรอกนามสกุล"),
    address: z.string().optional(),
    phone: z.string().trim().min(9, "กรุณากรอกหมายเลขโทรศัพท์").max(15, "หมายเลขยาวเกินไป"),
    school: z.string().trim().min(1, "กรุณากรอกโรงเรียน"),
    gpa: z.number().min(0).max(4),
    skills: z.string().optional(),
    reason: z.string().optional(),
    major: z.string().optional(),
    university: z.string().optional(),
    // file inputs (profile single, others multiple)
    photo: z.any().optional(),
    activities: z.any().optional(),
    awards: z.any().optional(),
    works: z.any().optional(),
  });

  type Task = z.infer<typeof TaskSchema> & { profilePhoto?: string; activities?: string[]; awards?: string[]; works?: string[] };

  const [tasks, setTasks] = useState<Task[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const addMember = useUserMembers((s) => s.addMember);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Task>({
    resolver: zodResolver(TaskSchema),
    defaultValues: { 
      firstName: "", lastName: "", address: "", phone: "", school: "", gpa: undefined, skills: "", reason: "", major: "", university: "",
    },
    mode: "onSubmit",
  });

  // watch photo input เพื่อทำ preview
  const photoFile = watch("photo");
  const activitiesFiles = watch("activities");
  const awardsFiles = watch("awards");
  const worksFiles = watch("works");

  useEffect(() => {
    if (photoFile && photoFile.length > 0) {
      const file = photoFile[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [photoFile]);

  // previews for multiple groups
  const [activitiesPreview, setActivitiesPreview] = useState<string[]>([]);
  const [awardsPreview, setAwardsPreview] = useState<string[]>([]);
  const [worksPreview, setWorksPreview] = useState<string[]>([]);

  useEffect(() => {
    if (activitiesFiles && activitiesFiles.length > 0) {
      setActivitiesPreview(Array.from(activitiesFiles as FileList).map((f: File) => URL.createObjectURL(f)));
    }
  }, [activitiesFiles]);

  useEffect(() => {
    if (awardsFiles && awardsFiles.length > 0) {
      setAwardsPreview(Array.from(awardsFiles as FileList).map((f: File) => URL.createObjectURL(f)));
    }
  }, [awardsFiles]);

  useEffect(() => {
    if (worksFiles && worksFiles.length > 0) {
      setWorksPreview(Array.from(worksFiles as FileList).map((f: File) => URL.createObjectURL(f)));
    }
  }, [worksFiles]);

  const onAdd = (data: Task) => {
    const photoFiles = data.photo;
    const activitiesFiles = data.activities;
    const awardsFiles = data.awards;
    const worksFiles = data.works;

  const profilePhoto = photoFiles && photoFiles.length > 0 ? URL.createObjectURL((photoFiles as FileList)[0]) : (editIndex !== null ? tasks[editIndex].profilePhoto : undefined);
  const activities = activitiesFiles ? Array.from(activitiesFiles as FileList).map((f: File) => URL.createObjectURL(f)) : (editIndex !== null ? tasks[editIndex].activities || [] : []);
  const awards = awardsFiles ? Array.from(awardsFiles as FileList).map((f: File) => URL.createObjectURL(f)) : (editIndex !== null ? tasks[editIndex].awards || [] : []);
  const works = worksFiles ? Array.from(worksFiles as FileList).map((f: File) => URL.createObjectURL(f)) : (editIndex !== null ? tasks[editIndex].works || [] : []);

    const newTask = {
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      phone: data.phone,
      school: data.school,
      gpa: data.gpa,
      skills: data.skills,
      reason: data.reason,
      major: data.major,
      university: data.university,
      profilePhoto,
      activities,
      awards,
      works,
    };

    if (editIndex !== null) {
      setTasks(prev => prev.map((t, i) => i === editIndex ? newTask : t));
      setEditIndex(null);
    } else {
      setTasks(prev => [...prev, newTask]);
    }

    // also add to global user member store
    const id = String(Date.now());
    addMember({ id, ...newTask });

  // navigate to teacher member list (view submissions)
  router.push('/app/teacher/member');

    reset();
    setPreview(null);
  };

  const onDelete = (index: number) => {
    setTasks(prev => prev.filter((_, i) => i !== index));
  };

  const onEdit = (index: number) => {
    const task = tasks[index];
    reset(task); // load ข้อมูลเดิมไปฟอร์ม
  setPreview(task.profilePhoto || null);
    setEditIndex(index);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-semibold text-slate-800 mb-4">Portfolio สำหรับสมัคร TCAS69</h1>

      <form onSubmit={handleSubmit(onAdd)} noValidate className="space-y-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">ชื่อ</label>
            <input className="text-black w-full border rounded px-3 py-2" placeholder="ชื่อ" {...register("firstName")} />
            {errors.firstName && <div className="text-sm text-red-600">{errors.firstName.message}</div>}
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">นามสกุล</label>
            <input className="text-black w-full border rounded px-3 py-2" placeholder="นามสกุล" {...register("lastName")} />
            {errors.lastName && <div className="text-sm text-red-600">{errors.lastName.message}</div>}
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">ที่อยู่</label>
          <input className="text-black w-full border rounded px-3 py-2" placeholder="ที่อยู่" {...register("address")} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">หมายเลขโทรศัพท์</label>
            <input className="text-black w-full border rounded px-3 py-2" placeholder="หมายเลขโทรศัพท์" {...register("phone")} />
            {errors.phone && <div className="text-sm text-red-600">{errors.phone.message}</div>}
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">โรงเรียน</label>
            <input className="text-black w-full border rounded px-3 py-2" placeholder="โรงเรียน" {...register("school")} />
            {errors.school && <div className="text-sm text-red-600">{errors.school.message}</div>}
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">GPA</label>
            <input className="text-black w-full border rounded px-3 py-2" type="number" step="0.01" placeholder="GPA" {...register("gpa", { valueAsNumber: true })} />
            {errors.gpa && <div className="text-sm text-red-600">GPA ต้องอยู่ระหว่าง 0.00 ถึง 4.00</div>}
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">ความสามารถพิเศษ</label>
          <input className="text-black w-full border rounded px-3 py-2" placeholder="ความสามารถพิเศษ" {...register("skills")} />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">เหตุผลในการสมัคร</label>
          <textarea className="text-black w-full border rounded px-3 py-2" placeholder="เหตุผลในการสมัคร" {...register("reason")} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">สาขาที่เลือก</label>
            <input className="text-black w-full border rounded px-3 py-2" placeholder="สาขาที่เลือก" {...register("major")} />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">มหาวิทยาลัย</label>
            <input className="text-blackw-full border rounded px-3 py-2" placeholder="มหาวิทยาลัย" {...register("university")} />
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Photo */}
          <div>
            <label className="block text-sm text-slate-600 mb-1">รูปโปรไฟล์</label>
            <input className="block w-full text-sm text-slate-500 
              file:mr-4 file:py-2 file:px-4 
              file:rounded-full file:border-0 
              file:text-sm file:font-semibold 
              file:bg-amber-50 file:text-sky-700 
              hover:file:bg-sky-100" 
              type="file" 
              {...register("photo")} 
              accept="image/*" 
            />
            {errors.photo && <div className="text-sm text-red-600">{(errors.photo as any)?.message}</div>}
            {preview && (
              <div className="mt-2">
                <img src={preview} alt="preview" className="w-32 h-32 object-cover rounded shadow-sm" />
              </div>
            )}
          </div>

          {/* Activities Photos */}
          <div>
            <label className="block text-sm text-slate-600 mb-1">รูปภาพกิจกรรม</label>
            <input className="block w-full text-sm text-slate-500 
              file:mr-4 file:py-2 file:px-4 
              file:rounded-full file:border-0 
              file:text-sm file:font-semibold 
              file:bg-amber-50 file:text-violet-700 
              hover:file:bg-violet-100" 
              type="file" 
              multiple 
              {...register("activities")} 
              accept="image/*" 
            />
            {activitiesPreview.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {activitiesPreview.map((url, idx) => (
                  <img key={idx} src={url} alt={`Activity ${idx + 1}`} className="w-full h-24 object-cover rounded shadow-sm" />
                ))}
              </div>
            )}
          </div>

          {/* Awards Photos */}
          <div>
            <label className="block text-sm text-slate-600 mb-1">รูปภาพรางวัล</label>
            <input className="block w-full text-sm text-slate-500 
              file:mr-4 file:py-2 file:px-4 
              file:rounded-full file:border-0 
              file:text-sm file:font-semibold 
              file:bg-amber-50 file:text-amber-700 
              hover:file:bg-amber-100" 
              type="file" 
              multiple 
              {...register("awards")} 
              accept="image/*" 
            />
            {awardsPreview.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {awardsPreview.map((url, idx) => (
                  <img key={idx} src={url} alt={`Award ${idx + 1}`} className="w-full h-24 object-cover rounded shadow-sm" />
                ))}
              </div>
            )}
          </div>

          {/* Works Photos */}
          <div>
            <label className="block text-sm text-slate-600 mb-1">รูปภาพผลงาน</label>
            <input className="block w-full text-sm text-slate-500 
              file:mr-4 file:py-2 file:px-4 
              file:rounded-full file:border-0 
              file:text-sm file:font-semibold 
              file:bg-amber-50 file:text-emerald-700 
              hover:file:bg-emerald-100" 
              type="file" 
              multiple 
              {...register("works")} 
              accept="image/*" 
            />
            {worksPreview.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {worksPreview.map((url, idx) => (
                  <img key={idx} src={url} alt={`Work ${idx + 1}`} className="w-full h-24 object-cover rounded shadow-sm" />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-20">
          <button type="submit" disabled={isSubmitting} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-sky-700">
            {editIndex !== null ? "บันทึกการแก้ไข" : "บันทึก"}
          </button>
          <button type="button" onClick={() => reset()} className="text-sm text-slate-600">ล้าง</button>
        </div>
      </form>
    </div>
  );
}