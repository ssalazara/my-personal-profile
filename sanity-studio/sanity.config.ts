import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {project} from './schemaTypes/project' // <-- Import the new schema
import {home} from './schemaTypes/home' // <-- Import the new schema


export default defineConfig({
  name: 'default',
  title: 'My Personal Profile',

  projectId: 'mq8wsgus',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
