import { redirect } from 'next/navigation';

export default function MySitesPage() {
  redirect('/sites?tab=manage');
}
