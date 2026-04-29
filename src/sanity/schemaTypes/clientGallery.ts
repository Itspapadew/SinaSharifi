import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'clientGallery',
  title: 'Client Gallery',
  type: 'document',
  fields: [
    defineField({
      name: 'shootName',
      title: 'Shoot name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'clientName',
      title: 'Client name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Gallery URL slug',
      description: 'The private URL — e.g. "sarah-wedding-2024"',
      type: 'slug',
      options: { source: 'shootName', maxLength: 96 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'password',
      title: 'Access password',
      description: 'Client enters this to unlock the gallery',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      description: 'R2 keys for each photo — added via upload script',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'key', title: 'R2 object key', type: 'string' },
            { name: 'filename', title: 'Original filename', type: 'string' },
            { name: 'previewUrl', title: 'Preview URL (web)', type: 'string' },
            { name: 'width', title: 'Width px', type: 'number' },
            { name: 'height', title: 'Height px', type: 'number' },
            { name: 'size', title: 'File size bytes', type: 'number' },
          ],
          preview: {
            select: { title: 'filename', subtitle: 'key' },
          },
        }
      ],
    }),
    defineField({
      name: 'expiresAt',
      title: 'Expiry date (optional)',
      description: 'Gallery becomes inaccessible after this date',
      type: 'datetime',
    }),
    defineField({
      name: 'message',
      title: 'Message to client (optional)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'allowDownload',
      title: 'Allow downloads?',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'createdAt',
      title: 'Created at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'shootName',
      subtitle: 'clientName',
    },
  },
})
