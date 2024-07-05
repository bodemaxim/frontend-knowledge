<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { useStore } from 'vuex'
import 'bootstrap/dist/css/bootstrap.min.css'
import { marked } from 'marked'

import SpinningLoader from './SpinningLoader.vue'
import SearchPanel from './SearchPanel.vue'

import type { IQuestion } from '@/interfaces/IData'

const store = useStore()
const isLoading = computed(() => store.getters.isLoading)

/**
 * Данные вопроса.
 */
const question: Ref<IQuestion | null> = ref<IQuestion | null>(null)

/**
 * Событие изменения вопроса для отображения.
 */
const onQuestionViewChanged = (questionView: IQuestion | null) => {
  question.value = questionView
}
</script>

<template>
  <main class="d-flex flex-column">
    <SpinningLoader v-if="isLoading" />
    <div class="mx-7 d-flex justify-content-between align-items-center">
      <h1 class="text-danger company-title">База знаний по фронтенду</h1>
      <p>Режим использования</p>
    </div>
    <div class="search-view-container">
      <div class="search-panel">
        <SearchPanel @question-view="onQuestionViewChanged($event)" />
      </div>
      <div class="view-panel">
        <div v-if="question">
          <h2>{{ question.question }}</h2>
          <p v-html="marked.parse(question.answer)"></p>
          <hr />
          <p><b>Тема: </b>{{ question.topic }}</p>
          <p><b>Уровень: </b>{{ question.level }}</p>
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
  width: 30%;
  max-width: 30%;
}

.view-panel {
  margin-right: 2em;
  overflow-x: auto;
}

.search-panel {
  margin-left: 2em;
}

.search-view-container {
  display: flex;
  flex-grow: 1;
}

/* XS */
@media (min-width: 320px) and (max-width: 575px) {
  main {
    font-size: 12px;
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
}

/* S */
@media (min-width: 576px) and (max-width: 767px) {
  main {
    font-size: 13px;
  }
}
</style>
