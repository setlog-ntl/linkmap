'use client';

import { motion } from 'framer-motion';
import type { SiteConfig } from '@/lib/config';

const levelWidth: Record<string, string> = {
  beginner: 'w-1/3',
  intermediate: 'w-2/3',
  advanced: 'w-full',
};

const levelLabel: Record<string, string> = {
  beginner: '입문',
  intermediate: '중급',
  advanced: '고급',
};

interface Props {
  config: SiteConfig;
}

export function AboutSection({ config }: Props) {
  return (
    <section id="about" className="py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          소개
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-400 dark:text-gray-400 leading-relaxed whitespace-pre-line">
              {config.about}
            </p>
          </motion.div>

          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4">기술 스택</h3>
            {config.skills.map((skill, i) => (
              <div key={i} className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-sm">{skill.name}</span>
                  <span className="text-xs text-gray-500">
                    {levelLabel[skill.level]}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-800 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full ${levelWidth[skill.level]}`}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
