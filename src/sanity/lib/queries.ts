import { groq } from 'next-sanity'

export const homePhotosQuery = groq`
  *[_type == "photo"] | order(publishedAt desc) [0...50] {
    _id,
    title,
    location,
    category,
    availableAsPrint,
    price,
    publishedAt,
    image {
      asset,
      hotspot,
      crop,
    }
  }
`

export const portfolioPhotosQuery = groq`
  *[_type == "photo"] | order(publishedAt desc) {
    _id,
    title,
    location,
    category,
    availableAsPrint,
    price,
    publishedAt,
    image {
      asset,
      hotspot,
      crop,
    }
  }
`

export const portfolioByCategoryQuery = groq`
  *[_type == "photo" && category == $category] | order(publishedAt desc) {
    _id,
    title,
    location,
    category,
    availableAsPrint,
    price,
    publishedAt,
    image {
      asset,
      hotspot,
      crop,
    }
  }
`

export const allStoriesQuery = groq`
  *[_type == "story"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    location,
    category,
    publishedAt,
    coverImage {
      asset,
      hotspot,
      crop,
    }
  }
`

export const storyBySlugQuery = groq`
  *[_type == "story" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    location,
    category,
    camera,
    story,
    availableAsPrint,
    price,
    edition,
    publishedAt,
    coverImage {
      asset,
      hotspot,
      crop,
    },
    images[] {
      asset,
      hotspot,
      crop,
      caption,
    }
  }
`
