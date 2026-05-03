const StudentProjectBanner = () => {
  return (
    <div
      role="banner"
      className="fixed left-0 right-0 top-0 z-[60] flex min-h-12 items-center justify-center border-b border-amber-700/40 bg-amber-100 px-4 py-2 text-center text-[12px] font-medium leading-snug text-amber-950 sm:text-[13px]"
    >
      <p>
        <span className="font-semibold">Student project — not affiliated with Coinbase</span>
        <span className="mx-1.5 hidden sm:inline">·</span>
        <span className="block sm:inline">
          This UI is for coursework only and is not a real cryptocurrency exchange.
        </span>
      </p>
    </div>
  );
};

export default StudentProjectBanner;
