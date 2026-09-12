import type { Property } from '../data/sampleData';

export function normalizeAmenities(input: any): string[] {
  if (!input) return [];
  let items: any[] = [];
  if (Array.isArray(input)) {
    items = input;
  } else if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      return normalizeAmenities(parsed);
    } catch {
      items = input.split(',').map((s) => s.trim());
    }
  }

  const result: string[] = [];
  for (const item of items) {
    if (typeof item === 'string') {
      const trimmed = item.trim();
      if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
        try {
          const inner = JSON.parse(trimmed);
          result.push(...normalizeAmenities(inner));
          continue;
        } catch {}
      }
      const cleaned = trimmed.replace(/^["'\\]+|["'\\]+$/g, '').trim();
      if (cleaned) result.push(cleaned);
    } else if (Array.isArray(item)) {
      result.push(...normalizeAmenities(item));
    }
  }
  return Array.from(new Set(result.filter((s) => typeof s === 'string' && s.length > 0)));
}

/**
 * Slug helpers. Property records don't have a stored slug field yet (that's a
 * fast-follow for the admin panel), so we derive one from the name on the fly.
 * This keeps existing sample/live data working unchanged while /properties/:slug
 * routing works today.
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function findPropertyBySlug(properties: Property[], slug: string): Property | undefined {
  return properties.find((p) => slugify(p.name) === slug);
}

/**
 * Emotional copy generators. These produce sensible, on-brand defaults from the
 * data we already have (type, location, amenities, description) so every existing
 * property gets a full cinematic page today — without requiring new admin fields
 * to be filled in first. Once `tagline` / `story` / etc. are added as real editable
 * fields in the admin panel, those should simply take priority over these defaults.
 */

const TAGLINES_BY_TYPE: Record<Property['type'], string[]> = {
  Villa: [
    'Where every sunrise feels like a private retreat.',
    'Crafted for families who value space and serenity.',
    'A home built for the way you want to live.',
  ],
  Apartment: [
    'Elevated living, designed around your family.',
    'A skyline residence built for modern family life.',
    'Where city convenience meets quiet comfort.',
  ],
  Plot: [
    'Where your story begins, one foundation at a time.',
    'The beginning of a home built entirely on your terms.',
    'A canvas for the life you\u2019re building.',
  ],
  Commercial: [
    'Space built for ambition to grow.',
    'Where your next chapter finds its address.',
    'Designed for the work that matters to you.',
  ],
};

export function getTagline(property: Property): string {
  const options = TAGLINES_BY_TYPE[property.type] ?? TAGLINES_BY_TYPE.Villa;
  return options[property.id % options.length];
}

export function getStoryOpening(property: Property): string {
  return `More than a place to live, ${property.name} in ${property.area}, ${property.location.split(',')[0]} is a space designed for the life that unfolds within it.`;
}

interface LifestyleMoment {
  time: string;
  title: string;
  text: string;
}

export function getLifestyleMoments(property: Property): LifestyleMoment[] {
  const isVilla = property.type === 'Villa' || property.type === 'Plot';
  return [
    {
      time: 'Morning',
      title: 'A Slower Start',
      text: isVilla
        ? 'Coffee on your own terrace, overlooking the garden you planted yourself.'
        : 'Coffee by the window, the city just waking up beneath you.',
    },
    {
      time: 'Afternoon',
      title: 'Room To Grow',
      text: 'Children playing safely within the community, always within sight, never underfoot.',
    },
    {
      time: 'Evening',
      title: 'Together, Unhurried',
      text: 'Sunset walks, quiet conversations, and a dinner table that everyone comes home for.',
    },
    {
      time: 'Night',
      title: 'Quiet Luxury',
      text: 'A home designed for comfort and calm \u2014 the kind of quiet you can only build, not buy.',
    },
  ];
}

interface LifestyleGroup {
  title: string;
  items: string[];
}

const GROUP_KEYWORDS: { title: string; keywords: string[] }[] = [
  { title: 'Wellness & Recreation', keywords: ['pool', 'spa', 'gym', 'yoga', 'wellness', 'sauna'] },
  { title: 'Family Living', keywords: ['home theater', 'theatre', 'smart home', 'play', 'kids', 'family'] },
  { title: 'Nature & Serenity', keywords: ['garden', 'park', 'green', 'view', 'lake', 'landscap'] },
  { title: 'Security & Community', keywords: ['security', 'gated', 'car garage', 'parking', 'club', 'community'] },
];

export function getLifestyleGroups(property: Property): LifestyleGroup[] {
  const cleanList = normalizeAmenities(property.amenities);
  const groups: LifestyleGroup[] = GROUP_KEYWORDS.map((g) => ({ title: g.title, items: [] as string[] }));
  const leftover: string[] = [];

  cleanList.forEach((amenity) => {
    const lower = amenity.toLowerCase();
    const match = GROUP_KEYWORDS.findIndex((g) => g.keywords.some((k) => lower.includes(k)));
    if (match >= 0) {
      groups[match].items.push(amenity);
    } else {
      leftover.push(amenity);
    }
  });

  if (leftover.length) {
    groups.push({ title: 'Refined Details', items: leftover });
  }

  return groups.filter((g) => g.items.length > 0);
}

export function getLocationNarrative(property: Property): string {
  return `Set in ${property.area}, ${property.name} keeps you close to everything that matters \u2014 stay connected to the city while enjoying the peace of a private residential enclave.`;
}

export const CONSTRUCTION_PHILOSOPHY = {
  title: 'Built For Generations',
  paragraphs: [
    'Every Lokah residence is delivered by a consecutive award-winning team, with an unsurpassed attention to detail on time and on budget.',
    'Our design and materials are chosen the same way a family chooses a home \u2014 to last, not just to look good on the day it\u2019s handed over.',
  ],
};
