'use client';

interface ConsoleFrameProps {
  url: string;
  children: React.ReactNode;
  className?: string;
}

export function ConsoleFrame({ url, children, className = '' }: ConsoleFrameProps) {
  return (
    <div className={`rounded-lg border overflow-hidden bg-muted/30 ${className}`}>
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/60 border-b">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="ml-2 text-[10px] text-muted-foreground font-mono truncate">{url}</span>
      </div>
      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
