import { GuideLayoutClient } from '@/components/guides/guide-layout-client';

export const revalidate = false;

export default function PaymentGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuideLayoutClient parentSlug="payment">{children}</GuideLayoutClient>;
}
