export function PlanVidhAILogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative mb-4">
        <img
          src="/logo.svg"
          alt="PlanVidyAII Logo"
          className="w-56 h-56 text-slate-800"
        />
      </div>
      
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800 tracking-wide font-serif">
          PlanVidyAI
        </h1>
      </div>
    </div>
  );
}