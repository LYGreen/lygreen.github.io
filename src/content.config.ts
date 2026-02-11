import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro:content";

const blog = defineCollection({
    loader: glob({ pattern: "**/[^_]*.md", base: "./src/blog" }),
    schema: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        author: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        date: z.date().optional(),
        updated: z.date().optional(),
    })
});

export const collections = {
    blog,
}
