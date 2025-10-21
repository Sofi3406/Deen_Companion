import TrackerNav from "../TrackerNav";

export default function TrackerLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-row">
      {/* Vertical sidebar on the left */}
      <TrackerNav />
      {/* Main content on the right */}
      <main className="flex-1 p-8 max-w-5xl mx-auto">{children}</main>
    </div>
  );
}
