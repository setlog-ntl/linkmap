import { ThemeToggle } from './theme-toggle';

export function Footer() {
  return (
    <footer className="border-t border-gray-800 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-gray-500 text-xs">
        <span>
          Powered by{' '}
          <a
            href="https://www.linkmap.biz"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-gray-300"
          >
            Linkmap
          </a>
        </span>
        <ThemeToggle />
      </div>
    </footer>
  );
}
