export const formatKST = (isoTime) => {
  const date = new Date(isoTime);
  // Convert to KST (UTC+9)
  const kstOffset = 9 * 60; // 9 hours in minutes
  const localOffset = date.getTimezoneOffset(); // in minutes
  const kstDate = new Date(date.getTime() + (kstOffset + localOffset) * 60000);

  const yyyy = kstDate.getFullYear();
  const mm = String(kstDate.getMonth() + 1).padStart(2, "0");
  const dd = String(kstDate.getDate()).padStart(2, "0");
  const hh = String(kstDate.getHours()).padStart(2, "0");
  const min = String(kstDate.getMinutes()).padStart(2, "0");
  const sec = String(kstDate.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec} (KST)`;
};
