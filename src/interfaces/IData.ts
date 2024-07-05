import { Levels, Topics } from '@/enum/Enum'

export interface IQuestion {
  id: number
  question: string
  answer: string
  topic: Topics
  keywords: string
  links: string
  level: Levels
}
