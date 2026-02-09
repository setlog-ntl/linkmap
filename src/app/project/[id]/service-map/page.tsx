'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ServiceMapClient = dynamic(
  () => import('@/components/service-map/service-map-client'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[600px] rounded-lg" />,
  }
);

export default function ServiceMapPage() {
  return <ServiceMapClient />;
}
