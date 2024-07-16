<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { useStore } from 'vuex'
import 'bootstrap/dist/css/bootstrap.min.css'
import { marked } from 'marked'

import SpinningLoader from './SpinningLoader.vue'
import SearchPanel from './SearchPanel.vue'

import { Levels, Topics } from '@/enum/Enum'

import type { IQuestion, ILink } from '@/interfaces/IData'

const store = useStore()
const isLoading = computed(() => store.getters.isLoading)

/**
 * Данные вопроса.
 */
const question: Ref<IQuestion | null> = ref<IQuestion | null>(null)

/**
 * Ссылки на ресурсы.
 */
const links: Ref<ILink[]> = ref<ILink[]>([])

/**
 * Событие изменения вопроса для отображения.
 */
const onQuestionViewChanged = (questionView: IQuestion | null) => {
  question.value = questionView
}

const getLevelText = (level: Levels): string => {
  console.log(question.value ? question.value.links : 'нет')

  switch (level) {
    case Levels.beginner:
      return 'начинающий'
    case Levels.intermediate:
      return 'средний'
    case Levels.advanced:
      return 'продвинутый'
    default:
      return 'неизвестно'
  }
}

const getTopicsText = (topic: Topics): string => {
  switch (topic) {
    case Topics.html:
      return 'HTML'
    case Topics.css:
      return 'CSS'
    case Topics.javascript:
      return 'JavaScript'
    case Topics.typescript:
      return 'TypeScript'
    case Topics.vue:
      return 'Vue'
    case Topics.browser:
      return 'Браузер'
    default:
      return 'неизвестно'
  }
}
</script>

<template>
  <main class="d-flex flex-column">
    <SpinningLoader v-if="isLoading" />
    <div class="mx-7 d-flex justify-content-between align-items-center">
      <h1 class="text-danger company-title mr-1">База знаний по фронтенду</h1>
      <p class="ml-1">Режим использования</p>
    </div>
    <div class="search-view-container">
      <div class="search-panel">
        <SearchPanel @question-view="onQuestionViewChanged($event)" />
      </div>
      <div class="view-panel">
        <div v-if="question" class="view-panel-question">
          <h2>{{ question.question }}</h2>
          <p v-html="marked.parse(question.answer)"></p>
          <hr />
          <p><b>Тема: </b>{{ getTopicsText(question.topic) }}</p>
          <p><b>Уровень: </b>{{ getLevelText(question.level) }}</p>
          <ul>
            <li v-for="item in question.links" :key="item">
              <a :href="item" target="blank">{{ item }}</a>
            </li>
          </ul>
        </div>
        <p v-else class="mt-7">Выберите вопрос, чтобы посмотреть ответ на него.</p>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
main {
  height: 100vh;
  width: 100vw;
  overflow-y: hidden;
}

.search-panel,
.view-panel {
  display: flex;
  flex-grow: 1;
  border: 1px solid #dee2e6;
  border-radius: 1rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  margin: 1em;
  padding: 1em;
  max-height: calc(100% - 180px);
}

.search-panel {
  width: 40%;
  max-width: 40%;
}

.view-panel {
  margin-right: 2em;
}

.view-panel-question {
  height: calc(100vh - 140px);
  overflow-y: auto;
}

.search-panel {
  margin-left: 2em;
}

.search-view-container {
  display: flex;
  flex-grow: 1;
}

hr {
  border: 2px solid gray;
}

/* XS */
@media (min-width: 320px) and (max-width: 575px) {
  main {
    font-size: 14px;
    overflow-y: auto;
  }

  .search-view-container {
    display: block;
  }

  .search-panel {
    display: block;
    width: 100%;
    max-width: calc(100% - 24px);
    height: auto;
    max-height: 60vh;
    margin: 1em;
  }

  .view-panel {
    margin: 1em;
  }

  .view-panel-question {
    height: auto;
  }
}

/* S */
@media (min-width: 576px) and (max-width: 767px) {
  main {
    font-size: 15px;
  }
}
</style>
