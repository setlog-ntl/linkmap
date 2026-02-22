import { redirect } from 'next/navigation';

export default function DangerPage() {
  redirect('/settings/account');
}
