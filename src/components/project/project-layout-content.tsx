'use client';

import { usePathname } from 'next/navigation';
import { ProjectTabs } from './project-tabs';

interface ProjectLayoutContentProps {
    children: React.ReactNode;
    projectId: string;
    projectName: string;
    projectDescription?: string;
}

export function ProjectLayoutContent({
    children,
    projectId,
    projectName,
    projectDescription,
}: ProjectLayoutContentProps) {
    const pathname = usePathname();
    // We want the canvas (service-map) to occupy the full screen without padding.
    const isCanvasView = pathname.endsWith('/service-map');

    if (isCanvasView) {
        return (
            <div className="relative h-[calc(100vh-3.5rem)] overflow-hidden">
                {/* We can overlay ProjectTabs on top of the canvas, or omit it and rely on Sidebar */}
                <div className="absolute top-4 left-6 z-10 w-[300px] md:hidden">
                    <div className="bg-background/80 backdrop-blur-md rounded-lg shadow-md border p-2">
                        <ProjectTabs projectId={projectId} />
                    </div>
                </div>

                {/* Full-bleed children — h-full works because parent has explicit height */}
                <div className="h-full w-full">
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className="container py-6 flex flex-col flex-1">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{projectName}</h1>
                {!!projectDescription && (
                    <p className="text-muted-foreground mt-1">{projectDescription}</p>
                )}
            </div>
            {/* Mobile tabs */}
            <div className="md:hidden">
                <ProjectTabs projectId={projectId} />
            </div>
            <div className="mt-6 flex-1 flex flex-col object-contain">
                {children}
            </div>
        </div>
    );
}
