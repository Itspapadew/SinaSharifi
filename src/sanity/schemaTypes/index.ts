import { type SchemaTypeDefinition } from 'sanity'
import story from './story'
import photo from './photo'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [story, photo],
}
