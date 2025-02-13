import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		draft: z.boolean().optional(),
	}),
});

const events = defineCollection({
	loader: glob({ base: "./src/content/events", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			slug: z.string(),
			location: z.string(),
			startDate: z.date().transform((date) => {
				return adjustForTimezone(date);
			}),
			endDate: z.date().transform((date) => {
				return adjustForTimezone(date);
			}),
			image: image(),
		}),
});

function adjustForTimezone(date: Date): Date {
	const month = date.getUTCMonth() + 1; // getUTCMonth() is zero-based
	const day = date.getUTCDate();
	const isEDT =
		(month > 3 && month < 11) ||
		(month === 3 && day >= 8) ||
		(month === 11 && day <= 1);
	const offsetInHours = isEDT ? 4 : 5;
	return new Date(date.getTime() + offsetInHours * 60 * 60 * 1000);
}

export const collections = { blog, events };
