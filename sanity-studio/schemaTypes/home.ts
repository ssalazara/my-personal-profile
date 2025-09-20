// sanity-studio/schemas/home.ts
import {defineField, defineType} from 'sanity'

export const home = defineType({
  name: 'home',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'This title is for internal use in the CMS.',
      initialValue: 'Home Page',
      readOnly: true, // Makes it non-editable in the studio
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'The main, large title on the homepage (e.g., "Hello, I\'m Simon").',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      description: 'The paragraph of text that appears below the main title.',
      rows: 3,
    }),
    defineField({
      name: 'skillsTitle',
      title: 'Skills Section Title',
      type: 'string',
      description: 'The headline for your skills list (e.g., "What I Do").',
      initialValue: 'My Core Skills',
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      description: 'A list of your key skills or services.',
      of: [{type: 'string'}], // This creates a simple list of text fields
    }),
  ],
})