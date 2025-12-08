import { Code2 } from 'lucide-react';

export function DeveloperCredit() {
  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md rounded-full shadow-lg">
      <Code2 className="w-4 h-4 text-gray-500" />
      <span className="text-xs text-gray-600">
        This is exclusively developed for{' '}
        <span className="text-[#727e90]">CNG Enterprises</span> by{' '}
        <span className="text-[#727e90]">Your Name</span>
      </span>
    </div>
  );
}
