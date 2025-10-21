import TrackerNav from "./TrackerNav";

export default function TrackerLayout({ children }) {
  return (
    <div>
      <TrackerNav />
      <div className="p-6">{children}</div>
    </div>
  );
}
