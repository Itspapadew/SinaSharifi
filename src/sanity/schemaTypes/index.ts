import { type SchemaTypeDefinition } from 'sanity'
import story from './story'
import photo from './photo'
import quickUpload from './quickUpload'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [story, photo, quickUpload],
}
