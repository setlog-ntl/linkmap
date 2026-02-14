'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Linkedin } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';

interface Props {
  config: SiteConfig;
}

export function ContactSection({ config }: Props) {
  return (
    <section id="contact" className="py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          함께 일하고 싶다면
        </motion.h2>

        <motion.p
          className="text-gray-400 dark:text-gray-400 mb-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          새로운 프로젝트나 협업 제안은 언제든 환영합니다.
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {config.email && (
            <a
              href={`mailto:${config.email}`}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              <Mail className="w-4 h-4" />
              이메일 보내기
            </a>
          )}
          {config.githubUsername && (
            <a
              href={`https://github.com/${config.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-3 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
          {config.linkedinUrl && (
            <a
              href={config.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-3 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
