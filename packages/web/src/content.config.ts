import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const courses = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    draft: z.boolean().default(false),
    roles: z.array(z.enum(['pm', 'marketer', 'sales', 'cto'])),
    estimatedHours: z.number().optional(),
    coverImage: z.string().optional(),
    stageContext: z.enum(['early-stage', 'late-stage', 'both']).default('both'),
  }),
});

const modules = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/modules' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    courseSlug: z.string(),
    order: z.number(),
    draft: z.boolean().default(false),
  }),
});

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    moduleSlug: z.string(),
    courseSlug: z.string(),
    order: z.number(),
    draft: z.boolean().default(false),
    estimatedMinutes: z.number(),
    objectives: z.array(z.string()),
  }),
});

export const collections = { courses, modules, lessons };
