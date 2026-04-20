import { defineField, defineType } from 'sanity'
import { AiTitleInput } from '../components/AiTitleInput'

export default defineType({
  name: 'photo',
  title: 'Portfolio Photo',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      components: { input: AiTitleInput },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
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
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'camera',
      title: 'Camera & lens',
      type: 'string',
    }),
    defineField({
      name: 'availableAsPrint',
      title: 'Available as print?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'price',
      title: 'Base price ($)',
      type: 'number',
    }),
    defineField({
      name: 'edition',
      title: 'Edition size',
      type: 'number',
      initialValue: 50,
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
      title: 'title',
      subtitle: 'location',
      media: 'image',
    },
  },
})
