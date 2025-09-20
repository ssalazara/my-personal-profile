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
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      description: 'The main image for the hero section.',
      options: {
        hotspot: true, // Enables the user to crop/position the image focus
      },
    }),
    defineField({
      name: 'heroImagePosition',
      title: 'Hero Image Position',
      type: 'string',
      description: 'Choose whether the image appears on the left or right of the text.',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio', // Makes it a radio button selector
      },
      initialValue: 'right', // Set a default value
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