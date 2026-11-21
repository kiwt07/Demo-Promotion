/** ช่องแบนเนอร์โฆษณาตัวอย่าง: แยกจากอันดับความคุ้มและติดป้ายชัดเจน */
export function Banner() {
  return (
    <aside className="banner" aria-label="พื้นที่โฆษณา">
      <span className="badge badge--sponsor">โฆษณา</span>
      <strong>พื้นที่แบนเนอร์พาร์ตเนอร์</strong>
      <span>ตัวอย่างตำแหน่งโฆษณา ไม่มีผลต่ออันดับความคุ้ม</span>
    </aside>
  )
}
