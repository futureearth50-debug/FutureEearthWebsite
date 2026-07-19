import { useState } from "react";
import { ChevronDown, Send, CheckCircle2, Clock } from "lucide-react";
import { contact, contactInfo, type Locale } from "@/content/site";

function Label({ children, index }: { children: React.ReactNode; index: string }) {
  return (
    <span className="flex items-center gap-2 mb-2 fe-mono" style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fe-slate-2)" }}>
      <span style={{ color: "var(--fe-steel-2)" }}>{index}</span>
      {children}
    </span>
  );
}

export function FacilityAssessmentForm({ locale }: { locale: Locale }) {
  const c = contact[locale];
  const isRtl = locale === "ar";
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const [f, setF] = useState({
    name: "", entity: "", email: "", mobile: "",
    projectType: "", roofType: "", consumption: "", notes: "",
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name || !f.email || !f.mobile || !f.projectType) { setError(true); return; }
    setError(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="fe-chat p-8 md:p-12 flex flex-col items-center text-center">
        <div className="grid place-items-center rounded-full mb-5" style={{ width: 68, height: 68, background: "var(--fe-green)", color: "white" }}>
          <CheckCircle2 size={34} />
        </div>
        <div className="fe-display" style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--fe-navy)", maxWidth: 440 }}>{c.thanks}</div>
        <div className="mt-4 inline-flex items-center gap-2" style={{ color: "var(--fe-slate)", fontSize: 14 }}>
          <Clock size={15} style={{ color: "var(--fe-amber-deep)" }} /> {contactInfo.hours[locale]}
        </div>
      </div>
    );
  }

  const selectStyle = { appearance: "none" as const, paddingInlineEnd: "2.5rem" };
  const chevron = (
    <ChevronDown size={17} className="pointer-events-none absolute top-1/2 -translate-y-1/2" style={{ [isRtl ? "left" : "right"]: "1rem", color: "var(--fe-slate-2)" }} />
  );

  return (
    <div className="fe-chat">
      <div className="p-6 md:p-8 border-b" style={{ background: "linear-gradient(135deg, #FFF8EC 0%, #FFFFFF 60%)", borderColor: "var(--fe-line)" }}>
        <div className="fe-eyebrow">{c.formEyebrow}</div>
        <h3 className="fe-display mt-3" style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--fe-navy)" }}>{c.formTitle}</h3>
        <p className="mt-2" style={{ color: "var(--fe-slate)", fontSize: "0.95rem", lineHeight: 1.55 }}>{c.formSub}</p>
      </div>

      <form onSubmit={submit} className="p-6 md:p-8 grid gap-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <label className="block">
            <Label index="01">{c.fields.name}</Label>
            <input className="fe-field" value={f.name} onChange={set("name")} placeholder={c.fields.name} />
          </label>
          <label className="block">
            <Label index="02">{c.fields.entity}</Label>
            <input className="fe-field" value={f.entity} onChange={set("entity")} placeholder={c.fields.entity} />
          </label>
          <label className="block">
            <Label index="03">{c.fields.email}</Label>
            <input type="email" dir="ltr" className="fe-field" value={f.email} onChange={set("email")} placeholder="name@company.com" style={isRtl ? { textAlign: "right" } : undefined} />
          </label>
          <label className="block">
            <Label index="04">{c.fields.mobile}</Label>
            <input type="tel" dir="ltr" className="fe-field" value={f.mobile} onChange={set("mobile")} placeholder="+966 5X XXX XXXX" style={isRtl ? { textAlign: "right" } : undefined} />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <label className="block">
            <Label index="05">{c.fields.projectType}</Label>
            <div className="relative">
              <select className="fe-field" style={selectStyle} value={f.projectType} onChange={set("projectType")}>
                <option value="" disabled>{c.selectPlaceholder}</option>
                {c.projectTypeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              {chevron}
            </div>
          </label>
          <label className="block">
            <Label index="06">{c.fields.roofType}</Label>
            <div className="relative">
              <select className="fe-field" style={selectStyle} value={f.roofType} onChange={set("roofType")}>
                <option value="" disabled>{c.selectPlaceholder}</option>
                {c.roofTypeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              {chevron}
            </div>
          </label>
        </div>

        <label className="block">
          <Label index="07">{c.fields.consumption}</Label>
          <input inputMode="numeric" className="fe-field" value={f.consumption} onChange={set("consumption")} placeholder={c.fields.consumption} />
        </label>

        <label className="block">
          <Label index="08">{c.fields.notes}</Label>
          <textarea rows={4} className="fe-field resize-none" value={f.notes} onChange={set("notes")} placeholder={c.fields.notes} />
        </label>

        {error && (
          <div style={{ fontSize: 13, color: "var(--destructive)" }}>
            {isRtl ? "يرجى تعبئة الحقول المطلوبة (الاسم، البريد، الجوال، نوع المشروع)." : "Please complete the required fields (name, email, mobile, project type)."}
          </div>
        )}

        <button type="submit" className="fe-btn fe-btn-primary justify-center w-full" style={{ padding: "1.05rem" }}>
          <Send size={16} /> {c.submit}
        </button>
      </form>
    </div>
  );
}
