/**
 * Unified template catalog — single source of truth.
 * Combines metadata (previously DB-only) with bundle file references.
 * No DB query needed for template listing.
 */

import { homepageTemplateSeedData, type HomepageTemplateSeed } from '../oneclick/homepage-templates';
import { getTemplateBySlug, type HomepageTemplateContent } from '../oneclick/homepage-template-content';

export interface Template {
  id: string;
  slug: string;
  name: string;
  nameKo: string;
  description: string;
  descriptionKo: string;
  previewImageUrl: string | null;
  framework: string;
  tags: string[];
  isPremium: boolean;
  displayOrder: number;
  isRecommended: boolean;
  deployTarget: string;
  requiredEnvVars: Array<{ key: string; description: string; required: boolean }>;
  /** Whether a code bundle is available for this template */
  hasBundle: boolean;
}

// Recommended templates
const RECOMMENDED_SLUGS = new Set(['personal-brand', 'digital-namecard']);

/**
 * Build the template catalog from seed data.
 * Only includes active templates that have code bundles available.
 */
function buildCatalog(): Template[] {
  return homepageTemplateSeedData
    .filter((seed) => seed.is_active)
    .filter((seed) => getTemplateBySlug(seed.slug) !== undefined)
    .sort((a, b) => a.display_order - b.display_order)
    .map((seed) => seedToTemplate(seed));
}

function seedToTemplate(seed: HomepageTemplateSeed): Template {
  return {
    id: seed.id,
    slug: seed.slug,
    name: seed.name,
    nameKo: seed.name_ko,
    description: seed.description,
    descriptionKo: seed.description_ko,
    previewImageUrl: seed.preview_image_url,
    framework: seed.framework,
    tags: seed.tags,
    isPremium: seed.is_premium,
    displayOrder: seed.display_order,
    isRecommended: RECOMMENDED_SLUGS.has(seed.slug),
    deployTarget: seed.deploy_target,
    requiredEnvVars: seed.required_env_vars,
    hasBundle: true,
  };
}

/** All active templates with code bundles, sorted by display_order */
export const TEMPLATES: Template[] = buildCatalog();

/** Get a template by ID */
export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

/** Get template content (files) by slug — delegates to existing bundle */
export function getTemplateContent(slug: string): HomepageTemplateContent | undefined {
  return getTemplateBySlug(slug);
}
