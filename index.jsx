import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Zap,
  Layers3,
  Flame,
  Ruler,
  LifeBuoy,
  Wrench,
  HardHat,
  TentTree,
  Shield,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ClipboardCheck,
  Shirt,
  BookOpen,
  Info,
  PauseCircle
} from "lucide-react";

/**
 * Work Permit Manual – ธุรกิจพันธุ์กุ้งทะเล 2
 * Document No.: MSBRC2-WP-01
 * Prepared by: SHE&En ธุรกิจพันธุ์กุ้งทะเล 2
 * Effective: 24/8/2568 | Rev: 0 | Review: 0
 */

const DOC = {
  business: "ธุรกิจพันธุ์กุ้งทะเล 2",
  docNo: "MSBRC2-WP-01",
  preparedBy: "SHE&En ธุรกิจพันธุ์กุ้งทะเล 2",
  effective: "24/8/2568",
  rev: "0",
  review: "0"
};

// ----------------------------- Data -----------------------------------------
// Each category includes color tokens for card border/background accents
const CATS = [
  {
    id: "elec",
    color: "border-yellow-200",
    headerBg: "from-yellow-50 to-white",
    icon: <Zap className="h-5 w-5 text-yellow-600" />,
    title: "งานไฟฟ้า (รวม LOTO)",
    must: [
      "ซ่อมตู้คอนโทรล/เดินสายเมนใหม่",
      "ทำงานใน MCC/DB ที่มีพลังงานตกค้าง (ต้อง LOTO)",
      "ซ่อมโบลเวอร์/ปั๊มน้ำ/โอโซน โดยต้องแยกพลังงาน"
    ],
    exempt: [
      "เปิด–ปิดสวิตช์/เดินเบรกเกอร์ตามการใช้งานปกติ (ภายใต้ WI)",
      "งานปลั๊ก–ต่อ–สาย ถอดปลั๊กออกและควบคุมโดยผู้ทำงาน"
    ],
    hazards: ["ไฟฟ้าดูด/อาร์คแฟลช", "ไฟไหม้", "สะดุ้งตกจากที่สูง"],
    precheck: ["LOTO 7 ขั้นตอน", "Test before touch", "ตรวจสอบ RCD/ELCB", "เขตหวงห้ามและป้ายเตือน"],
    ppe: ["ถุงมือฉนวน", "หน้ากากกันอาร์ค", "ชุด FR", "รองเท้า Dielectric"],
    examples: ["ซ่อม MCC ปั๊มน้ำ", "เดินสายไฟโรงอนุบาล"],
    toolbox: ["ผังวงจรโดยย่อ", "ผู้ถือกุญแจ LOTO", "เขตหวงห้าม"],
    stop: ["พบแรงดันไฟหลัง LOTO", "กลิ่นไหม้/ควัน", "อุปกรณ์ฉนวนชำรุด"]
  },
  {
    id: "cs",
    color: "border-blue-200",
    headerBg: "from-blue-50 to-white",
    icon: <Layers3 className="h-5 w-5 text-blue-600" />,
    title: "การเข้าทำงานในที่อับอากาศ (Confined Space Entry)",
    must: ["เข้าถังเก็บสารเคมี/แทงก์น้ำเค็ม/ไฮโป", "เข้า wet well บ่อสูบที่เสี่ยงก๊าซ"],
    exempt: ["ไม่มีงานประจำประเภทนี้", "Reclassify เป็น non-permit โดยพิสูจน์ปลอดภัย"],
    hazards: ["ออกซิเจนต่ำ/ก๊าซพิษ", "จมน้ำ/ engulfment"],
    precheck: ["ตรวจวัด O2/LEL/H2S/CO", "LOTO ของไหล/พลังงาน", "กำหนดบทบาท 3 คน", "ระบบสื่อสารพร้อม"],
    ppe: ["Full body harness + winch", "Gas detector", "SCBA หรือ respirator ตามความเสี่ยง"],
    examples: ["เข้าแทงก์โซดาไฟเปลี่ยนวาล์ว", "ลง wet well ดึงตะแกรงเศษวัสดุ"],
    toolbox: ["มาตรฐานอากาศปลอดภัย", "เส้นทางอพยพ", "ผู้เฝ้าระวัง"],
    stop: ["ค่าอากาศนอกเกณฑ์", "สื่อสารขัดข้อง", "ไม่มีผู้เฝ้าระวัง"]
  },
  {
    id: "hot",
    color: "border-orange-200",
    headerBg: "from-orange-50 to-white",
    icon: <Flame className="h-5 w-5 text-orange-600" />,
    title: "งานความร้อน/ประกายไฟ (Hot Work)",
    must: ["เชื่อม/ตัด/เจียรโครงเหล็ก", "ใช้แก๊สตัดโลหะ"],
    exempt: ["สว่าน/เครื่องมือไฟฟ้าที่ไม่เกิดประกายไฟรุนแรง", "ทำในเขตเชื่อมถาวรที่ควบคุมแล้ว"],
    hazards: ["ไฟไหม้/ระเบิด", "สะเก็ดไฟลามเศษวัสดุ"],
    precheck: ["ตรวจ LEL < 10%", "ย้ายเชื้อเพลิงในรัศมี ~15 ม.", "Fire Watch 30–60 นาที", "ตรวจสาย/ถังแก๊ส"],
    ppe: ["หน้ากากเชื่อม", "ถุงมือหนัง", "รองเท้านิรภัย", "แว่นตา"],
    examples: ["เชื่อมฐานมอเตอร์", "เจียรแก้สลักพัดน้ำ"],
    toolbox: ["เส้นทางอพยพ", "สัญญาณหยุดงานฉุกเฉิน"],
    stop: ["พบก๊าซรั่ว", "ไม่มี Fire Watch"]
  },
  {
    id: "wah",
    color: "border-purple-200",
    headerBg: "from-purple-50 to-white",
    icon: <Ruler className="h-5 w-5 text-purple-600" />,
    title: "งานบนที่สูง (≥ 2 ม. หรือเอียง > 15°)",
    must: ["ปีนเสาไฟฟ้า", "ใช้บันได > 2 ม. เปลี่ยนหลอดไฟ"],
    exempt: ["บันได < 2 ม. ในพื้นที่ปลอดภัย"],
    hazards: ["ตกจากที่สูง", "วัตถุตกหล่น"],
    precheck: [
      "ตรวจนั่งร้าน/MEWP (Green tag)",
      "ตรวจสอบบันได (สภาพ, ยางกันลื่น, มุมตั้ง 1:4, มัดยึด)",
      "กั้นเขตตกวัตถุ"
    ],
    ppe: ["Full body harness", "หมวกนิรภัยมีสายรัดคาง", "รองเท้ากันลื่น"],
    examples: ["เปลี่ยนหลอดไฟในโรงเรือน", "ปีนปรับสายสื่อสาร"],
    toolbox: ["วิธีปีน 3 จุดสัมผัส", "สัญญาณมือ"],
    stop: ["ลมแรง/ฝนตก", "ไม่มีจุดยึดที่ได้มาตรฐาน"]
  },
  {
    id: "water",
    color: "border-sky-200",
    headerBg: "from-sky-50 to-white",
    icon: <LifeBuoy className="h-5 w-5 text-sky-600" />,
    title: "งานเกี่ยวข้องกับน้ำ (ใกล้/บน/ในน้ำ)",
    must: ["ซ่อมอุปกรณ์ริมขอบบ่อ", "ลงน้ำซ่อมตะแกรงดูด", "ใช้เครื่องมือไฟฟ้าใกล้น้ำ"],
    exempt: [
      "ลงบ่อเช็คอาหารกุ้ง (Routine)",
      "เดินตรวจระบบน้ำ (Routine)",
      "เดินบนทางที่มีราวกันตก/พื้นกันลื่น"
    ],
    hazards: ["จมน้ำ", "ไฟฟ้าดูดใกล้น้ำ", "ลื่นตะไคร่"],
    precheck: [
      "Buddy system + ผู้เฝ้าระวัง",
      "เสื้อชูชีพมาตรฐาน 100N",
      "ห่วงชูชีพ/ไม้ตะขอ/เชือกพร้อมใช้"
    ],
    ppe: ["เสื้อชูชีพ", "รองเท้ากันลื่น", "หมวกนิรภัยเมื่อยกของ"],
    examples: ["เดินปิดปั๊มน้ำริมบ่อ", "ลงน้ำเปลี่ยนตะแกรงหัวท่อดูด"],
    toolbox: ["วิธีช่วยชีวิตเบื้องต้น", "สัญญาณมือกับผู้เฝ้าระวัง"],
    stop: ["ฝนฟ้าคะนอง", "ไม่มีอุปกรณ์กู้ภัย"]
  },
  {
    id: "mach",
    color: "border-slate-300",
    headerBg: "from-slate-50 to-white",
    icon: <Wrench className="h-5 w-5 text-slate-600" />,
    title: "งานเครื่องจักร (Machine Safety)",
    must: ["เปิดฝาครอบ/การ์ดเครื่องจักร", "บายพาส Interlock", "ซ่อมบำรุงที่มีพลังงานคงค้าง"],
    exempt: [
      "เดินเครื่องตามปกติพร้อมการ์ดครบ",
      "เปิด Generator ตามรอบทดสอบ (Routine)",
      "เปิดเครื่องโอโซนตาม SOP งานประจำ"
    ],
    hazards: ["ถูกหนีบ/ดึง", "เสียงดัง/สั่นสะเทือน"],
    precheck: ["LOTO ทุกพลังงาน", "ทดสอบปุ่ม E-Stop", "คืนการ์ดครบ"],
    ppe: ["ถุงมือกันบาด", "แว่นตา", "ที่อุดหู"],
    examples: ["ถอดฝาครอบพัดน้ำ", "ปรับตั้งเกียร์กล่องพัดลม"],
    toolbox: ["วิธีทดลองเดินเครื่อง", "สัญญาณเริ่ม–หยุด"],
    stop: ["Guard ไม่ครบ", "สัญญาณโอโซนเกินเกณฑ์"]
  },
  {
    id: "lift",
    color: "border-amber-200",
    headerBg: "from-amber-50 to-white",
    icon: <HardHat className="h-5 w-5 text-amber-600" />,
    title: "การยกและผูกมัด (Lifting and Rigging)",
    must: ["ยกปั๊ม/มอเตอร์ขนาดใหญ่ด้วยเครน/รอก/รถยก"],
    exempt: ["ยกด้วยแรงคน/รถเข็นตาม WI"],
    hazards: ["ของร่วงหล่น", "สายสลิงขาด"],
    precheck: ["ตรวจสลิง/ตะขอ/มุมยก", "ผู้ให้สัญญาณมีใบรับรอง"],
    ppe: ["หมวกนิรภัย", "เสื้อสะท้อนแสง", "ถุงมือ"],
    examples: ["ยกปั๊มจุ่มจากบ่ออนุบาล", "ยก Generator ขึ้นแท่น"],
    toolbox: ["สัญญาณมือ", "เส้นทางเคลื่อนย้าย"],
    stop: ["อุปกรณ์ยกชำรุด", "ลมแรง"]
  },
  {
    id: "excav",
    color: "border-lime-200",
    headerBg: "from-lime-50 to-white",
    icon: <TentTree className="h-5 w-5 text-lime-700" />,
    title: "การขุดดิน/วางท่อ",
    must: ["ขุดบ่อใหม่/คลองส่งน้ำ", "ซ่อมท่อใต้ดิน/วางท่อใหม่"],
    exempt: ["ขุด/ตักตื้น <0.3 ม. เป็น Routine"],
    hazards: ["ดินถล่ม", "ชนท่อ/สายไฟใต้ดิน"],
    precheck: ["Permit to dig + ตรวจผัง", "ทำค้ำยัน/ลาดบ่า", "กั้นเขตงาน"],
    ppe: ["หมวกนิรภัย", "รองเท้าเซฟตี้", "เสื้อสะท้อนแสง"],
    examples: ["ขุดวางท่อส่งน้ำ", "ซ่อมท่อรั่วริมน้ำ"],
    toolbox: ["สัญญาณมือกับแบ็กโฮ", "วิธีเข้าถึงฉุกเฉิน"],
    stop: ["น้ำซึมมาก/ผนังร้าว", "พบสาธารณูปโภคไม่ได้ระบุ"]
  }
];

// ----------------------------- Helpers --------------------------------------
function Section({ title, icon, colorClass, items }) {
  return (
    <div>
      <strong className={`flex items-center gap-1 ${colorClass}`}>
        {icon} {title}
      </strong>
      <ul className="list-disc ml-5">{items.map((m, i) => <li key={i}>{m}</li>)}</ul>
    </div>
  );
}

function runSelfTests() {
  const requiredKeys = ["must", "exempt", "hazards", "precheck", "ppe", "examples", "toolbox", "stop"];
  const missing = CATS
    .map(c => ({ id: c.id, miss: requiredKeys.filter(k => !Array.isArray(c[k])) }))
    .filter(x => x.miss.length > 0);
  // eslint-disable-next-line no-console
  console.log("[SelfTest] categories:", CATS.length, "missing:", missing);
  // Specific assertions
  const wahHasLadder = (CATS.find(c => c.id === "wah")?.precheck || []).some(s => s.includes("บันได"));
  const machExemptOk = (CATS.find(c => c.id === "mach")?.exempt || []).join(" ").includes("Generator") && (CATS.find(c => c.id === "mach")?.exempt || []).join(" ").includes("โอโซน");
  const waterRoutineOk = (CATS.find(c => c.id === "water")?.exempt || []).join(" ").includes("เช็คอาหารกุ้ง") && (CATS.find(c => c.id === "water")?.exempt || []).join(" ").includes("ตรวจระบบน้ำ");
  // eslint-disable-next-line no-console
  console.log("[SelfTest] ladder:", wahHasLadder, "machExempt:", machExemptOk, "waterRoutine:", waterRoutineOk);
}

export default function WorkPermitManualApp() {
  const [q, setQ] = useState("");

  useEffect(() => {
    runSelfTests();
  }, []);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return CATS;
    return CATS.filter(c => [
      c.title,
      ...(c.must || []),
      ...(c.exempt || []),
      ...(c.hazards || []),
      ...(c.precheck || []),
      ...(c.ppe || []),
      ...(c.examples || []),
      ...(c.toolbox || []),
      ...(c.stop || [])
    ].join(" ").toLowerCase().includes(k));
  }, [q]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900">
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-sm">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-base md:text-lg font-semibold leading-tight">คู่มือขออนุญาตทำงาน – ธุรกิจพันธุ์กุ้งทะเล 2</h1>
          </div>
          <div className="text-[11px] md:text-xs text-slate-700 md:ml-auto">
            <div>{DOC.business} • จัดทำโดย {DOC.preparedBy}</div>
            <div>เลขที่เอกสาร: <strong>{DOC.docNo}</strong> • บังคับใช้: {DOC.effective} • Rev.{DOC.rev} • Review.{DOC.review}</div>
          </div>
          <Button size="sm" variant="secondary" onClick={() => window.print()} className="md:ml-4">
            <FileText className="mr-1 h-4 w-4" /> พิมพ์/บันทึก PDF
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Definition card */}
        <div className="mb-6">
          <Card className="border-emerald-200 bg-emerald-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg flex items-center gap-2"><Info className="h-4 w-4 text-emerald-600" />นิยาม: งานที่ต้องขออนุญาต และงานที่ไม่ต้องขออนุญาต</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-800 space-y-3">
              <div>
                <span className="inline-flex items-center rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-xs font-medium mr-2">ต้องขออนุญาต</span>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>เข้าข่าย TS 5.x (ไฟฟ้า/LOTO, อับอากาศ, งานร้อน, ที่สูง, ใกล้น้ำ, เครื่องจักร)</li>
                  <li>เป็นงานไม่ประจำ/ดัดแปลงระบบ ไม่มี WI ครอบคลุม หรือทำในพื้นที่หน่วยงานอื่น</li>
                  <li>กฎหมาย/มาตรฐานกำหนด (Confined Space, Diving, Hot Work)</li>
                  <li>มีงานซ่อม/ทดสอบ/ใช้เครื่องมือไฟฟ้าใกล้น้ำ หรือพลังงานคงค้างต้อง LOTO</li>
                </ul>
              </div>
              <div>
                <span className="inline-flex items-center rounded-full bg-slate-700 text-white px-2.5 py-0.5 text-xs font-medium mr-2">ไม่ต้องขออนุญาต</span>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>เปิด Generator ตามรอบทดสอบ / เปิดเครื่องโอโซน ตาม SOP (Routine)</li>
                  <li>ลงบ่อเช็คอาหารกุ้ง และเดินตรวจระบบน้ำ (Routine) บนเส้นทางที่ปลอดภัย</li>
                  <li>งานไฟฟ้าแบบ plug-and-cord ที่ถอดปลั๊กแล้วและอยู่ในสายตาผู้ทำงาน</li>
                  <li>ใช้บันไดต่ำกว่า 2 ม. ในพื้นที่ปลอดภัยตาม WI</li>
                </ul>
              </div>
              <div className="text-[12px] text-slate-600">หมายเหตุ: หากขอบเขตงาน/สภาพแวดล้อม/ความเสี่ยงเปลี่ยนแปลง ให้ยกระดับเป็น “ต้องขออนุญาต” ทันที</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 flex items-center gap-2">
          <Input placeholder="ค้นหาประเภทงาน..." value={q} onChange={e => setQ(e.target.value)} className="max-w-sm" />
          {q && <Badge variant="secondary" className="rounded-full">ผลลัพธ์: {filtered.length}</Badge>}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map(c => (
            <Card key={c.id} className={`shadow-md rounded-2xl overflow-hidden border ${c.color}`}>
              <CardHeader className={`bg-gradient-to-r ${c.headerBg}`}>
                <CardTitle className="flex items-center gap-3 text-base md:text-lg font-semibold">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-sm border">{c.icon}</div>
                  <span>{c.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3 p-4">
                <Section title="1. ต้องขอใบอนุญาตเมื่อ:" icon={<CheckCircle2 className="h-4 w-4 text-emerald-700" />} colorClass="text-emerald-700" items={c.must} />
                <Section title="2. ยกเว้นไม่ต้องขออนุญาตเมื่อ:" icon={<XCircle className="h-4 w-4 text-slate-700" />} colorClass="text-slate-700" items={c.exempt} />
                <Section title="3. อันตรายหลัก:" icon={<AlertTriangle className="h-4 w-4 text-red-700" />} colorClass="text-red-700" items={c.hazards} />
                <Section title="4. มาตรการ / Pre-start check:" icon={<ClipboardCheck className="h-4 w-4 text-indigo-700" />} colorClass="text-indigo-700" items={c.precheck} />
                <Section title="5. PPE ที่ต้องใช้:" icon={<Shirt className="h-4 w-4 text-orange-700" />} colorClass="text-orange-700" items={c.ppe} />
                <Section title="6. ตัวอย่างงานเฉพาะของหน่วยงาน:" icon={<BookOpen className="h-4 w-4 text-teal-700" />} colorClass="text-teal-700" items={c.examples} />
                <Section title="7. หัวข้อที่ต้องชี้แจง:" icon={<Info className="h-4 w-4 text-purple-700" />} colorClass="text-purple-700" items={c.toolbox} />
                <Section title="8. หยุดงานทันทีเมื่อ:" icon={<PauseCircle className="h-4 w-4 text-pink-700" />} colorClass="text-pink-700" items={c.stop} />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
