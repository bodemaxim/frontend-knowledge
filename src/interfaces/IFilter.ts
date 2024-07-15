import { Levels, Topics, Ready } from '@/enum/Enum'

export interface IFilter {
    topic: Topics
    level: Levels
    ready: Ready
  }
  