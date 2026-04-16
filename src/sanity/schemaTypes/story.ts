import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'story',
  title: 'Story / Post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'settings', title: 'Settings' },
    { name: 'print', title: 'Print & Shop' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'settings',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'showOnHome',
      title: 'Show on main page?',
      description: 'Turn on to feature this post on the homepage.',
      type: 'boolean',
      group: 'settings',
      initialValue: true,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Photos',
      description: 'Drag and drop multiple photos at once',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              title: 'Caption (optional)',
              type: 'string',
            }
          ]
        }
      ],
      options: {
        layout: 'grid',
      },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'settings',
      options: {
        list: [
          { title: 'Landscape', value: 'landscape' },
          { title: 'Wildlife', value: 'wildlife' },
          { title: 'Portrait', value: 'portrait' },
          { title: 'Macro', value: 'macro' },
          { title: 'Family Portrait', value: 'family' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'story',
      title: 'Story',
      description: 'The moment, the feeling, what happened',
      type: 'array',
      group: 'content',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'camera',
      title: 'Camera & lens',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'availableAsPrint',
      title: 'Available as print?',
      type: 'boolean',
      group: 'print',
      initialValue: false,
    }),
    defineField({
      name: 'price',
      title: 'Starting price ($)',
      type: 'number',
      group: 'print',
    }),
    defineField({
      name: 'edition',
      title: 'Edition size',
      type: 'number',
      group: 'print',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'settings',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: 'Latest first',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location',
      media: 'coverImage',
    },
  },
})
