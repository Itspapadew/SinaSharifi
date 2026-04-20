import { groq } from 'next-sanity'

export const homePhotosQuery = groq`
{
  "photos": *[_type == "photo"] | order(publishedAt desc) [0...20] {
    _id,
    _type,
    title,
    location,
    category,
    availableAsPrint,
    price,
    publishedAt,
    "src": image.asset->url,
  },
  "quickUploads": *[_type == "quickUpload"] | order(publishedAt desc) [0...20] {
    _id,
    _type,
    location,
    category,
    publishedAt,
    "images": images[].asset->url,
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
    "src": image.asset->url,
  }
`

export const printsQuery = groq`
  *[_type == "photo" && availableAsPrint == true] | order(publishedAt desc) {
    _id,
    title,
    location,
    category,
    price,
    edition,
    publishedAt,
    "src": image.asset->url,
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
    "src": coverImage.asset->url,
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
    "coverSrc": coverImage.asset->url,
    images[] {
      "src": asset->url,
      caption,
    }
  }
`
