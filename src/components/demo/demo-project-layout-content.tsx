'use client';

import { usePathname } from 'next/navigation';
import { DemoProjectTabs } from './demo-project-tabs';

interface DemoProjectLayoutContentProps {
  children: React.ReactNode;
  projectId: string;
  projectName: string;
  projectDescription?: string;
}

export function DemoProjectLayoutContent({
  children,
  projectId,
  projectName,
  projectDescription,
}: DemoProjectLayoutContentProps) {
  const pathname = usePathname();
  const isCanvasView = pathname.endsWith('/service-map');

  if (isCanvasView) {
    return (
      <div className="flex-1 flex flex-col relative h-[calc(100vh-6.5rem)] overflow-hidden">
        <div className="absolute top-4 left-6 z-10 w-[300px] md:hidden">
          <div className="bg-background/80 backdrop-blur-md rounded-lg shadow-md border p-2">
            <DemoProjectTabs projectId={projectId} />
          </div>
        </div>
        <div className="flex-1 w-full h-full">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 flex flex-col flex-1">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{projectName}</h1>
        {projectDescription && (
          <p className="text-muted-foreground mt-1">{projectDescription}</p>
        )}
      </div>
      <div className="md:hidden mb-6">
        <DemoProjectTabs projectId={projectId} />
      </div>
      <div className="mt-6 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
