// sanity-studio/schemas/project.ts
import {defineField, defineType} from 'sanity'

// The fix is here: changing `export default` to `export const project =`
export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    // --- NEW FIELD: SLUG ---
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'A unique, URL-friendly identifier. Click "Generate" to create from title.',
      options: {
        source: 'title', // Automatically generate from the 'title' field
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    // --- NEW FIELD: COVER IMAGE ---
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      description: 'A brief summary shown on project listing cards.',
    }),
    defineField({
      name: 'projectUrl',
      title: 'Project URL',
      type: 'url',
      description: 'The URL to the live project, if available.',
    }),
    // --- NEW FIELD: PAGE BUILDER ---
    defineField({
      name: 'pageBuilder',
      title: 'Page Content',
      type: 'array',
      description: 'Add and order content blocks to build the project page.',
      of: [
        // We will add our Banner, Quote, etc. types here later
      ],
    }),
  ],
})