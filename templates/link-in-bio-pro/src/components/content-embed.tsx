'use client';

interface Props {
  youtubeUrl: string;
}

function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/
  );
  return match ? match[1] : null;
}

export function ContentEmbed({ youtubeUrl }: Props) {
  const videoId = extractYoutubeId(youtubeUrl);
  if (!videoId) return null;

  return (
    <div className="w-full rounded-xl overflow-hidden">
      <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full rounded-xl"
        />
      </div>
    </div>
  );
}
