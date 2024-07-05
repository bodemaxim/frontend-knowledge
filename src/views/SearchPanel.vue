<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { store } from '@/store/store'

import initDb from '@/db/InitDb'

import type { IQuestion } from '@/interfaces/IData'

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

  for (const item of data.values) {
    const newItem = {
      id: item[0],
      question: item[1],
      answer: item[2],
      topic: item[3],
      keywords: item[4],
      links: item[5],
      level: item[6]
    }

    transformedData.push(newItem)
  }
  dataToSearch.value = JSON.parse(JSON.stringify(transformedData))
  searchResults.value = JSON.parse(JSON.stringify(transformedData))
}

/**
 * Искать сотрудников по ид или нескольким ид.
 */
const onSearch = async () => {
  if (searchQuery.value.length === 0) {
    emits('questionView', null)
    searchResults.value = []
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
    return mainString.includes(subString)
  }

  for (const item of dataToSearch.value) {
    if (containsSubstring(item.question, query)) result.push(item.id)
  }
  console.log(result)
  return result
}

/**
 * Просмотреть ответ.
 */
const viewAnswer = (question: IQuestion) => {
  emits('questionView', question)
}
//#endregion Методы

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
    <p><b>Поиск вопросов</b></p>
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

    <p class="mt-5"><b>Результаты</b></p>
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
  height: calc(100vh - 300px);
}

/* XS */
@media (min-width: 320px) and (max-width: 575px) {
  .scrollable-container {
    height: calc(60vh - 200px);
  }
}
</style>
