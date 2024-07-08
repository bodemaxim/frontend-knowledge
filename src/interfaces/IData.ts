import { Levels, Topics } from '@/enum/Enum'

export interface IQuestion {
  id: number
  question: string
  answer: string
  topic: Topics
  links: string
  level: Levels
}
