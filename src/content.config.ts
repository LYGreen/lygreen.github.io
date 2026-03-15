import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro:content";

const blog = defineCollection({
    loader: glob({ pattern: "**/[^_]*.md", base: "./src/blog" }),
    schema: z.object({
        pin: z.boolean().optional(),
        title: z.string(),
        description: z.string(),
        author: z.string(),
        category: z.string(),
        tags: z.array(z.string()),
        date: z.date(),
        updated: z.date(),
    })
});

export const collections = {
    blog,
}
