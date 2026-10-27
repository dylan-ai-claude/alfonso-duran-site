import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One markdown file per project in src/content/work/. See README.md for every field.
const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    // shorter name for the home-page stage, when the title is long
    stageTitle: z.string().optional(),
    client: z.string().optional(),
    place: z.string(),
    disciplines: z.array(z.string()),
    order: z.number(),
    summary: z.string(),
    cover: z.string(),
    // big picture at the top of the project page
    hero: z.string(),
    // featured projects appear on the big home-page stage, in `order`
    featured: z.boolean().default(false),
    stage: z
      .object({ left: z.string(), right: z.string(), ink: z.string().default('#ffffff') })
      .optional(),
    images: z.array(z.object({ src: z.string(), caption: z.string().optional() })),
  }),
});

export const collections = { work };
