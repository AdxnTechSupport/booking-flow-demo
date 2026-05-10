import { useState, useMemo } from "react";
import { format, parseISO } from "date-fns";
import { PHYSICIANS, STATUS_META } from "../data";
import { useApp } from "../store";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const { state, dispatch } = useApp();
  const [filterPhysician, setFilterPhysician] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const enrichedBookings = useMemo(() => {
    return state.bookings.map((b) => {
      const slot = state.slots.find((s) => s.id === b.slotId);
      const physician = PHYSICIANS.find((p) => p.id === b.patientDetails.physicianId);
      return { ...b, slot, physician };
    });
  }, [state.bookings, state.slots]);

  const filtered = useMemo(() => {
    return enrichedBookings.filter((b) => {
      if (filterPhysician !== "all" && b.physician?.id !== filterPhysician) return false;
      if (filterStatus !== "all" && b.status !== filterStatus) return false;
      return true;
    }).sort((a, b) => new Date(a.slot?.datetime) - new Date(b.slot?.datetime));
  }, [enrichedBookings, filterPhysician, filterStatus]);

  const stats = useMemo(() => {
    const total = state.bookings.length;
    const pending = state.bookings.filter((b) => b.status === "pending").length;
    const confirmed = state.bookings.filter((b) => b.status === "confirmed").length;
    const cancelled = state.bookings.filter((b) => b.status === "cancelled").length;
    return { total, pending, confirmed, cancelled };
  }, [state.bookings]);

  function updateStatus(bookingId, status) {
    dispatch({ type: "UPDATE_STATUS", bookingId, status });
    if (selectedBooking?.id === bookingId) {
      setSelectedBooking((prev) => ({ ...prev, status }));
    }
  }

  return (
    <div className={styles.admin}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>MedBook Admin</h2>
          <p>Physician scheduling portal</p>
        </div>

        <div className={styles.statCards}>
          <div className={styles.statCard}>
            <div className={styles.statNum}>{stats.total}</div>
            <div className={styles.statLabel}>Total</div>
          </div>
          <div className={`${styles.statCard} ${styles.statPending}`}>
            <div className={styles.statNum}>{stats.pending}</div>
            <div className={styles.statLabel}>Pending</div>
          </div>
          <div className={`${styles.statCard} ${styles.statConfirmed}`}>
            <div className={styles.statNum}>{stats.confirmed}</div>
            <div className={styles.statLabel}>Confirmed</div>
          </div>
          <div className={`${styles.statCard} ${styles.statCancelled}`}>
            <div className={styles.statNum}>{stats.cancelled}</div>
            <div className={styles.statLabel}>Cancelled</div>
          </div>
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Doctor</label>
            <select value={filterPhysician} onChange={(e) => setFilterPhysician(e.target.value)}>
              <option value="all">All Physicians</option>
              {PHYSICIANS.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.main}>
        {state.bookings.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <h3>No bookings yet</h3>
            <p>Switch to the Patient View to book an appointment, then return here to manage it.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3>No bookings match your filters</h3>
            <p>Try adjusting the physician or status filter.</p>
          </div>
        ) : (
          <div className={styles.bookingList}>
            {filtered.map((b) => (
              <div
                key={b.id}
                className={`${styles.bookingCard} ${selectedBooking?.id === b.id ? styles.bookingSelected : ""}`}
                onClick={() => setSelectedBooking(b)}
              >
                <div className={styles.bookingLeft}>
                  <div className={styles.bookingPatient}>
                    {b.patientDetails.firstName} {b.patientDetails.lastName}
                  </div>
                  <div className={styles.bookingMeta}>
                    {b.physician?.name} ·{" "}
                    {b.slot ? format(parseISO(b.slot.datetime), "MMM d 'at' h:mm a") : "—"}
                  </div>
                  <div className={styles.bookingReason}>{b.patientDetails.reason}</div>
                </div>
                <div className={styles.bookingRight}>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedBooking && (
        <div className={styles.detailPanel}>
          <div className={styles.detailHeader}>
            <h3>Booking Details</h3>
            <button className={styles.closeBtn} onClick={() => setSelectedBooking(null)}>✕</button>
          </div>

          <div className={styles.detailSection}>
            <div className={styles.detailLabel}>Patient</div>
            <div className={styles.detailValue}>
              {selectedBooking.patientDetails.firstName} {selectedBooking.patientDetails.lastName}
            </div>
            <div className={styles.detailSub}>{selectedBooking.patientDetails.email}</div>
            <div className={styles.detailSub}>{selectedBooking.patientDetails.phone}</div>
          </div>

          <div className={styles.detailSection}>
            <div className={styles.detailLabel}>Appointment</div>
            <div className={styles.detailValue}>{selectedBooking.physician?.name}</div>
            <div className={styles.detailSub}>{selectedBooking.physician?.specialty}</div>
            {selectedBooking.slot && (
              <div className={styles.detailSub}>
                {format(parseISO(selectedBooking.slot.datetime), "EEEE, MMMM d, yyyy")}
                {" at "}
                {format(parseISO(selectedBooking.slot.datetime), "h:mm a")}
              </div>
            )}
          </div>

          <div className={styles.detailSection}>
            <div className={styles.detailLabel}>Reason for visit</div>
            <div className={styles.detailValue}>{selectedBooking.patientDetails.reason}</div>
            {selectedBooking.patientDetails.notes && (
              <div className={styles.detailNotes}>{selectedBooking.patientDetails.notes}</div>
            )}
          </div>

          <div className={styles.detailSection}>
            <div className={styles.detailLabel}>Date of birth</div>
            <div className={styles.detailValue}>
              {selectedBooking.patientDetails.dob
                ? format(new Date(selectedBooking.patientDetails.dob + "T00:00:00"), "MMMM d, yyyy")
                : "—"}
            </div>
          </div>

          <div className={styles.detailSection}>
            <div className={styles.detailLabel}>Status</div>
            <div className={styles.statusRow}>
              <StatusBadge status={selectedBooking.status} />
            </div>
          </div>

          <div className={styles.actionBtns}>
            {selectedBooking.status !== "confirmed" && selectedBooking.status !== "cancelled" && (
              <button
                className={styles.btnConfirm}
                onClick={() => updateStatus(selectedBooking.id, "confirmed")}
              >
                ✓ Confirm Appointment
              </button>
            )}
            {selectedBooking.status !== "cancelled" && (
              <button
                className={styles.btnCancel}
                onClick={() => updateStatus(selectedBooking.id, "cancelled")}
              >
                ✕ Cancel Appointment
              </button>
            )}
            {selectedBooking.status === "cancelled" && (
              <button
                className={styles.btnConfirm}
                onClick={() => updateStatus(selectedBooking.id, "pending")}
              >
                ↩ Restore to Pending
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.pending;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 600,
        background: meta.bg,
        color: meta.color,
        letterSpacing: "0.03em",
      }}
    >
      {meta.label}
    </span>
  );
}