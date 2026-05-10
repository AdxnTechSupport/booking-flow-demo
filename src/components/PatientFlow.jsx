import { useState, useMemo } from "react";
import { format, parseISO, isSameDay } from "date-fns";
import { PHYSICIANS, VISIT_REASONS } from "../data";
import { useApp } from "../store";
import styles from "./PatientFlow.module.css";

const STEPS = ["Choose Doctor", "Pick a Time", "Your Details", "Confirmed"];

export default function PatientFlow() {
  const { state, dispatch } = useApp();
  const [step, setStep] = useState(0);
  const [selectedPhysician, setSelectedPhysician] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    reason: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [confirmedBookingId, setConfirmedBookingId] = useState(null);

  const availableSlots = useMemo(() => {
    if (!selectedPhysician) return [];
    return state.slots.filter(
      (s) => s.physicianId === selectedPhysician.id && !s.booked
    );
  }, [state.slots, selectedPhysician]);

  const availableDays = useMemo(() => {
    const seen = new Set();
    const days = [];
    for (const s of availableSlots) {
      const d = format(parseISO(s.datetime), "yyyy-MM-dd");
      if (!seen.has(d)) {
        seen.add(d);
        days.push(parseISO(s.datetime));
      }
    }
    return days.sort((a, b) => a - b).slice(0, 10);
  }, [availableSlots]);

  const slotsForDay = useMemo(() => {
    if (!selectedDay) return [];
    return availableSlots
      .filter((s) => isSameDay(parseISO(s.datetime), selectedDay))
      .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
  }, [availableSlots, selectedDay]);

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!form.phone.match(/^[\d\s\-()+]{7,}$/)) e.phone = "Valid phone required";
    if (!form.dob) e.dob = "Required";
    if (!form.reason) e.reason = "Please select a reason";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    dispatch({
      type: "BOOK_APPOINTMENT",
      slotId: selectedSlot.id,
      patientDetails: {
        ...form,
        physicianId: selectedPhysician.id,
        slotDatetime: selectedSlot.datetime,
      },
    });
    const id = `booking-${state.nextBookingId}`;
    setConfirmedBookingId(id);
    setStep(3);
  }

  function resetFlow() {
    setStep(0);
    setSelectedPhysician(null);
    setSelectedSlot(null);
    setSelectedDay(null);
    setForm({ firstName: "", lastName: "", email: "", phone: "", dob: "", reason: "", notes: "" });
    setErrors({});
    setConfirmedBookingId(null);
  }

  if (step === 3) {
    const slot = selectedSlot;
    const physician = selectedPhysician;
    return (
      <div className={styles.confirmCard}>
        <div className={styles.confirmIcon}>✓</div>
        <h2>Appointment Requested</h2>
        <p className={styles.confirmSub}>
          Your request is <strong>pending confirmation</strong> from {physician.name}'s office. You'll receive an email at <strong>{form.email}</strong>.
        </p>
        <div className={styles.confirmDetails}>
          <div className={styles.detailRow}>
            <span>Doctor</span>
            <span>{physician.name} · {physician.specialty}</span>
          </div>
          <div className={styles.detailRow}>
            <span>Date & Time</span>
            <span>{format(parseISO(slot.datetime), "EEEE, MMMM d 'at' h:mm a")}</span>
          </div>
          <div className={styles.detailRow}>
            <span>Reason</span>
            <span>{form.reason}</span>
          </div>
        </div>
        <button className={styles.btnPrimary} onClick={resetFlow}>
          Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.stepper}>
        {STEPS.slice(0, 3).map((label, i) => (
          <div
            key={i}
            className={`${styles.stepItem} ${i === step ? styles.stepActive : ""} ${i < step ? styles.stepDone : ""}`}
          >
            <div className={styles.stepNum}>{i < step ? "✓" : i + 1}</div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div>
          <h2 className={styles.sectionTitle}>Choose your doctor</h2>
          <p className={styles.sectionSub}>All physicians are accepting new patients unless noted.</p>
          <div className={styles.physicianGrid}>
            {PHYSICIANS.map((p) => (
              <div
                key={p.id}
                className={`${styles.physicianCard} ${selectedPhysician?.id === p.id ? styles.selected : ""} ${!p.acceptingNew ? styles.notAccepting : ""}`}
                onClick={() => p.acceptingNew && setSelectedPhysician(p)}
              >
                <div className={styles.avatar}>{p.avatar}</div>
                <div className={styles.physicianInfo}>
                  <div className={styles.physicianName}>{p.name}</div>
                  <div className={styles.physicianSpec}>{p.specialty}</div>
                  <p className={styles.physicianBio}>{p.bio}</p>
                  {!p.acceptingNew && (
                    <span className={styles.notAcceptingBadge}>Not accepting new patients</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.navRow}>
            <span />
            <button
              className={styles.btnPrimary}
              disabled={!selectedPhysician}
              onClick={() => setStep(1)}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 className={styles.sectionTitle}>
            Available times with {selectedPhysician.name}
          </h2>
          <p className={styles.sectionSub}>Select a date, then choose a time slot.</p>

          {availableDays.length === 0 ? (
            <p className={styles.emptyMsg}>No available times in the next two weeks. Please try another doctor.</p>
          ) : (
            <>
              <div className={styles.dayStrip}>
                {availableDays.map((day) => (
                  <button
                    key={day.toISOString()}
                    className={`${styles.dayBtn} ${selectedDay && isSameDay(day, selectedDay) ? styles.daySelected : ""}`}
                    onClick={() => { setSelectedDay(day); setSelectedSlot(null); }}
                  >
                    <span className={styles.dayName}>{format(day, "EEE")}</span>
                    <span className={styles.dayNum}>{format(day, "d")}</span>
                    <span className={styles.dayMon}>{format(day, "MMM")}</span>
                  </button>
                ))}
              </div>

              {selectedDay && (
                <div className={styles.slotGrid}>
                  {slotsForDay.length === 0 ? (
                    <p className={styles.emptyMsg}>No slots on this day.</p>
                  ) : (
                    slotsForDay.map((slot) => (
                      <button
                        key={slot.id}
                        className={`${styles.slotBtn} ${selectedSlot?.id === slot.id ? styles.slotSelected : ""}`}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {format(parseISO(slot.datetime), "h:mm a")}
                      </button>
                    ))
                  )}
                </div>
              )}
            </>
          )}

          <div className={styles.navRow}>
            <button className={styles.btnSecondary} onClick={() => setStep(0)}>← Back</button>
            <button
              className={styles.btnPrimary}
              disabled={!selectedSlot}
              onClick={() => setStep(2)}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className={styles.sectionTitle}>Your details</h2>
          <p className={styles.sectionSub}>
            Booking with {selectedPhysician.name} on{" "}
            {format(parseISO(selectedSlot.datetime), "MMMM d 'at' h:mm a")}
          </p>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>First name</label>
              <input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="Jane"
                className={errors.firstName ? styles.inputError : ""}
              />
              {errors.firstName && <span className={styles.errorMsg}>{errors.firstName}</span>}
            </div>
            <div className={styles.field}>
              <label>Last name</label>
              <input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Smith"
                className={errors.lastName ? styles.inputError : ""}
              />
              {errors.lastName && <span className={styles.errorMsg}>{errors.lastName}</span>}
            </div>
            <div className={styles.field}>
              <label>Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane@example.com"
                className={errors.email ? styles.inputError : ""}
              />
              {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
            </div>
            <div className={styles.field}>
              <label>Phone number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(416) 555-0100"
                className={errors.phone ? styles.inputError : ""}
              />
              {errors.phone && <span className={styles.errorMsg}>{errors.phone}</span>}
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Date of birth</label>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className={errors.dob ? styles.inputError : ""}
              />
              {errors.dob && <span className={styles.errorMsg}>{errors.dob}</span>}
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Reason for visit</label>
              <select
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className={errors.reason ? styles.inputError : ""}
              >
                <option value="">Select a reason…</option>
                {VISIT_REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {errors.reason && <span className={styles.errorMsg}>{errors.reason}</span>}
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Additional notes <span className={styles.optional}>(optional)</span></label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                placeholder="Any additional information for the doctor…"
              />
            </div>
          </div>

          <div className={styles.navRow}>
            <button className={styles.btnSecondary} onClick={() => setStep(1)}>← Back</button>
            <button className={styles.btnPrimary} onClick={handleSubmit}>
              Request Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}