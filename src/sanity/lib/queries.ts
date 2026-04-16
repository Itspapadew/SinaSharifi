import { groq } from 'next-sanity'

export const latestStoriesQuery = groq`
  *[_type == "story" && featuredOnHome == true] | order(publishedAt desc) [0...12] {
    _id,
    title,
    slug,
    location,
    category,
    availableAsPrint,
    price,
    publishedAt,
    coverImage {
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
    availableAsPrint,
    price,
    publishedAt,
    coverImage {
      asset,
      hotspot,
      crop,
    }
  }
`

export const storiesByCategoryQuery = groq`
  *[_type == "story" && category == $category] | order(publishedAt desc) {
    _id,
    title,
    slug,
    location,
    category,
    availableAsPrint,
    price,
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
