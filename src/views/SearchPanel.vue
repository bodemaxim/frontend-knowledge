<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { store } from '@/store/store'

import initDb from '@/db/InitDb'

import type { IQuestion } from '@/interfaces/IData'
import type { IFilter } from '@/interfaces/IFilter'
import { Topics, Levels, Ready } from '@/enum/Enum'

//#region Props и Emits
const emits = defineEmits<{
  questionView: [value: IQuestion | null]
}>()
//#endregion Props и Emits

//#region Лоадер
const setLoadingTrue = () => {
  store.dispatch('toggleLoading', true)
}

const setLoadingFalse = () => {
  store.dispatch('toggleLoading', false)
}
//#endregion Лоадер

//#region Данные
/**
 * Упрощенные данные пользователей.
 */
const dataToSearch: Ref<IQuestion[]> = ref<IQuestion[]>([])

/**
 * Вводимый запрос.
 */
const searchQuery: Ref<string> = ref<string>('')

/**
 * Результаты поиска.
 */
const searchResults: Ref<IQuestion[]> = ref<IQuestion[]>([])

/**
 * Текущие значения фильтра.
 */
let filter: IFilter = {
  topic: Topics.all,
  level: Levels.all,
  ready: Ready.true
}

/**
 * Отображаемая строка установленного значения фильтра "Тема"
 */
const topicFilterValue: Ref<string> = ref<string>('все')

/**
 * Отображаемая строка установленного значения фильтра "Тема"
 */
const levelFilterValue: Ref<string> = ref<string>('все')

/**
 * Отображаемая строка установленного значения фильтра "Готовность"
 */
const readyFilterValue: Ref<string> = ref<string>('да')
//#endregion Данные

//#region Методы

/**
 * Инициализировать данные.
 */
const initData = async () => {
  setLoadingTrue()

  const dataFromDb: initSqlJs.QueryExecResult[] = await initDb()
  transformDataFromDb(dataFromDb)

  setLoadingFalse()
}

/**
 * Преобразовать данные из базы данных.
 */
const transformDataFromDb = (dataFromDb: initSqlJs.QueryExecResult[]) => {
  const data: initSqlJs.QueryExecResult = dataFromDb[0]

  const transformedData: any[] = []

  //добавить проверку на пустую строку, нули в данных трансформировать в нужное
  for (const item of data.values) {
    const newItem = {
      id: item[0],
      question: item[1],
      answer: item[2],
      topic: item[3],
      links: item[4],
      level: item[5],
      isReady: item[6] === 1 ? Ready.true : Ready.false
    }

    transformedData.push(newItem)
  }
  dataToSearch.value = JSON.parse(JSON.stringify(transformedData))
  searchResults.value = JSON.parse(JSON.stringify(transformedData))
  console.log(dataToSearch.value)
}

/**
 * Искать сотрудников по ид или нескольким ид.
 */
const onSearch = async () => {
  if (searchQuery.value.length === 0) {
    emits('questionView', null)
    searchResults.value = JSON.parse(JSON.stringify(dataToSearch.value))

    return
  }

  const ids: number[] = parseSearchQuery(searchQuery.value)

  searchResults.value = dataToSearch.value.filter((item) => ids.includes(item.id))
}

/**
 * Преобразовать строковый запрос в массив идентификаторов.
 */
const parseSearchQuery = (str: string): number[] => {
  const query: string = str.trim()
  const result: number[] = []

  const containsSubstring = (mainString: string, subString: string): boolean => {
    return mainString.toLowerCase().includes(subString.toLowerCase())
  }

  for (const item of dataToSearch.value) {
    if (containsSubstring(item.question, query)) result.push(item.id)
  }

  return result
}

/**
 * Просмотреть ответ.
 */
const viewAnswer = (question: IQuestion) => {
  emits('questionView', question)
}
//#endregion Методы

//#region Фильтр

/**
 * Фильтровать данные.
 */
const setFilter = () => {
  console.log('setFilter filter', filter)

  let data: IQuestion[] = []

  if (filter.topic === Topics.all) {
    data = [...dataToSearch.value]
    console.log('1', data)
  } else {
    data = dataToSearch.value.filter((item) => item.topic === filter.topic)
    console.log('1.1')
  }

  if (filter.level !== Levels.all) data = data.filter((item) => item.level === filter.level)
  console.log('2', data)

  if (filter.ready !== Ready.all) data = data.filter((item) => item.isReady === filter.ready)
  console.log('3', data)

  searchResults.value = [...data]
  console.log(searchResults.value.length)
}

/**
 * Сортировать по теме.
 */
const sortByTopic = (topic: Topics) => {
  switch (topic) {
    case Topics.html:
      filter.topic = Topics.html
      setFilter()
      topicFilterValue.value = 'HTML'
      break
    case Topics.css:
      filter.topic = Topics.css
      setFilter()
      topicFilterValue.value = 'CSS'
      break
    case Topics.javascript:
      filter.topic = Topics.javascript
      setFilter()
      topicFilterValue.value = 'JavaScript'
      break
    case Topics.typescript:
      filter.topic = Topics.typescript
      setFilter()
      topicFilterValue.value = 'TypeScript'
      break
    case Topics.vue:
      filter.topic = Topics.vue
      setFilter()
      topicFilterValue.value = 'Vue'
      break
    case Topics.browser:
      filter.topic = Topics.browser
      setFilter()
      topicFilterValue.value = 'Браузер'
      break
    case Topics.all:
      filter.topic = Topics.all
      setFilter()
      topicFilterValue.value = 'Все'
      break
  }
}

/**
 * Сортировать по теме.
 */
const sortByLevel = (level: Levels) => {
  switch (level) {
    case Levels.beginner:
      filter.level = Levels.beginner
      setFilter()
      levelFilterValue.value = 'джун'
      break
    case Levels.intermediate:
      filter.level = Levels.intermediate
      setFilter()
      levelFilterValue.value = 'мидл'
      break
    case Levels.advanced:
      filter.level = Levels.advanced
      setFilter()
      levelFilterValue.value = 'про'
      break
    case Levels.all:
      filter.level = Levels.all
      setFilter()
      levelFilterValue.value = 'все'
      break
  }
}

/**
 * Сортировать по готовности.
 */
const sortByReady = (ready: Ready) => {
  switch (ready) {
    case Ready.true:
      filter.ready = Ready.true
      setFilter()
      readyFilterValue.value = 'да'
      break
    case Ready.false:
      filter.ready = Ready.false
      setFilter()
      readyFilterValue.value = 'нет'
      break
    case Ready.all:
      filter.ready = Ready.all
      setFilter()
      readyFilterValue.value = 'все'
      break
  }
}
//#endregion Фильтр

watch(
  () => searchQuery.value,
  () => onSearch()
)

//#region Инициализация
initData()
//#endregion Инициализация
</script>

<template>
  <main class="mt-5">
    <div class="d-flex flex-row align-items-start">
      <div class="dropdown">
        <button
          class="btn btn-primary dropdown-toggle filter-btn-1"
          type="button"
          data-bs-toggle="dropdown"
        >
          <img src="/images/icon-topics.svg" alt="Тема" width="24" height="24" class="mt-1 mb-1" />
          <p class="d-inline ml-2">{{ topicFilterValue }}</p>
        </button>
        <ul class="dropdown-menu">
          <li @click="sortByTopic(Topics.all)" class="dropdown-item">Все</li>
          <li @click="sortByTopic(Topics.html)" class="dropdown-item">HTML</li>
          <li @click="sortByTopic(Topics.css)" class="dropdown-item">CSS</li>
          <li @click="sortByTopic(Topics.javascript)" class="dropdown-item">JavaScript</li>
          <li @click="sortByTopic(Topics.typescript)" class="dropdown-item">TypeScript</li>
          <li @click="sortByTopic(Topics.vue)" class="dropdown-item">Vue</li>
          <li @click="sortByTopic(Topics.browser)" class="dropdown-item">Браузер</li>
        </ul>
      </div>

      <div class="dropdown ml-5">
        <button
          class="btn btn-primary dropdown-toggle filter-btn-2"
          type="button"
          data-bs-toggle="dropdown"
        >
          <img
            src="/images/icon-levels.svg"
            alt="Уровень"
            width="24"
            height="24"
            class="mt-1 mb-1"
          />
          <p class="d-inline ml-2">{{ levelFilterValue }}</p>
        </button>
        <ul class="dropdown-menu">
          <li @click="sortByLevel(Levels.beginner)" class="dropdown-item">джун</li>
          <li @click="sortByLevel(Levels.intermediate)" class="dropdown-item">мидл</li>
          <li @click="sortByLevel(Levels.advanced)" class="dropdown-item">про</li>
          <li @click="sortByLevel(Levels.all)" class="dropdown-item">все</li>
        </ul>
      </div>

      <div class="dropdown ml-5">
        <button
          class="btn btn-primary dropdown-toggle filter-btn-2"
          type="button"
          data-bs-toggle="dropdown"
        >
          <img
            src="/images/icon-ready.svg"
            alt="Готовность"
            width="24"
            height="24"
            class="mt-1 mb-1"
          />
          <p class="d-inline ml-2">{{ readyFilterValue }}</p>
        </button>
        <ul class="dropdown-menu">
          <li @click="sortByReady(Ready.true)" class="dropdown-item">да</li>
          <li @click="sortByReady(Ready.false)" class="dropdown-item">нет</li>
          <li @click="sortByReady(Ready.all)" class="dropdown-item">все</li>
        </ul>
      </div>
    </div>

    <form>
      <div class="input-group mb-3 p-2">
        <input
          type="text"
          class="form-control search-form"
          placeholder="Поиск..."
          v-model="searchQuery"
        />
      </div>
    </form>

    <v-virtual-scroll
      class="scrollable-container"
      :items="searchResults"
      v-if="searchResults.length > 0"
    >
      <template v-slot:default="{ item }"
        ><p @click="viewAnswer(item)" class="border rounded mt-1 mb-1 p-3 question-item">
          {{ item.question }}
        </p></template
      >
    </v-virtual-scroll>
    <p v-else>Не найдено</p>
  </main>
</template>

<style lang="scss" scoped>
$font-family-main: 'Montserrat', sans-serif;
$transition-time: 0.2s;
$hover-background-color: lightskyblue;

main {
  font-family: $font-family-main;
  overflow: hidden;
  max-width: 100%;
}

.search-form {
  font-family: $font-family-main;
}

.question-item {
  margin: 0;
  padding: 0;
  &:hover {
    background-color: $hover-background-color;
    cursor: pointer;
    transition: $transition-time;
  }
}

.scrollable-container {
  height: calc(100vh - 250px);
}

.filter-btn-1 {
  width: 150px;
  overflow: hidden;
}

.filter-btn-2 {
  width: 110px;
  overflow: hidden;
}

/* XS */
@media (min-width: 320px) and (max-width: 575px) {
  .scrollable-container {
    height: calc(60vh - 150px);
  }

  .filter-btn-1,
  .filter-btn-2 {
    width: 90px;
    overflow: hidden;
  }
}
</style>
