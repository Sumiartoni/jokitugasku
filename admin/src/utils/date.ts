/**
 * Dynamic Date & Time Utility for JokiTugasKu
 * Automatically syncs with the user's real-time browser clock and Indonesian locale.
 */

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const MONTH_SHORT_ID = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
];

const DAY_NAMES_ID = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
];

/**
 * Format current date & time: "Selasa, 18 Agustus 2026 • 15:51:27 WIB"
 */
export function formatLiveDateTime(date: Date = new Date()): string {
  const dayName = DAY_NAMES_ID[date.getDay()];
  const day = date.getDate();
  const month = MONTH_NAMES_ID[date.getMonth()];
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${dayName}, ${day} ${month} ${year} • ${hours}:${minutes}:${seconds} WIB`;
}

/**
 * Format standard Indonesian date: "18 Agustus 2026"
 */
export function formatIndoDate(date: Date = new Date()): string {
  const day = date.getDate();
  const month = MONTH_NAMES_ID[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Format short Indonesian date: "18 Agt 2026, 15:51"
 */
export function formatShortDateTime(date: Date = new Date()): string {
  const day = date.getDate();
  const month = MONTH_SHORT_ID[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

/**
 * Get dynamic relative deadline string from now
 * e.g., "Hari ini, 20:00 WIB", "Besok, 12:00 WIB", "20 Agustus 2026, 18:00 WIB"
 */
export function getRelativeDeadline(daysFromNow: number, targetHour: string = '18:00'): string {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysFromNow);

  if (daysFromNow === 0) {
    return `Hari ini, ${targetHour} WIB`;
  }
  if (daysFromNow === 1) {
    return `Besok, ${targetHour} WIB`;
  }

  const day = targetDate.getDate();
  const month = MONTH_NAMES_ID[targetDate.getMonth()];
  const year = targetDate.getFullYear();
  return `${day} ${month} ${year}, ${targetHour} WIB`;
}

/**
 * Relative time helper: "10 mnt lalu", "1 jam lalu", "Kemarin"
 */
export function formatTimeAgo(minutesAgo: number): string {
  if (minutesAgo < 1) return 'Baru saja';
  if (minutesAgo < 60) return `${minutesAgo} mnt lalu`;
  const hours = Math.floor(minutesAgo / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}
