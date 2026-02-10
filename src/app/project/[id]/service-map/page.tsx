'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ServiceMapClient = dynamic(
  () => import('@/components/service-map/service-map-client'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[calc(100vh-16rem)] min-h-[500px] max-h-[900px] rounded-lg" />,
  }
);

export default function ServiceMapPage() {
  return <ServiceMapClient />;
}
