interface VCardData {
  name: string;
  title?: string | null;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
}

export function generateVCard(data: VCardData): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${data.name}`,
    `N:${data.name};;;;`,
  ];

  if (data.title) lines.push(`TITLE:${data.title}`);
  if (data.company) lines.push(`ORG:${data.company}`);
  if (data.email) lines.push(`EMAIL;TYPE=INTERNET:${data.email}`);
  if (data.phone) lines.push(`TEL;TYPE=CELL:${data.phone}`);
  if (data.address) lines.push(`ADR;TYPE=WORK:;;${data.address};;;;`);
  if (data.website) lines.push(`URL:${data.website}`);

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

export function generateVCardDataUrl(data: VCardData): string {
  return generateVCard(data);
}
