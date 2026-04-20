import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'quickUpload',
  title: 'Quick Upload',
  type: 'document',
  fields: [
    defineField({
      name: 'images',
      title: 'Photos',
      description: 'Drag and drop multiple photos at once',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        }
      ],
      options: { layout: 'grid' },
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: 'location',
      title: 'Location (optional)',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category (optional)',
      type: 'string',
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
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      media: 'images.0',
      subtitle: 'location',
    },
    prepare({ media, subtitle }) {
      return {
        title: 'Quick Upload',
        media,
        subtitle: subtitle || 'No location',
      }
    }
  },
})
