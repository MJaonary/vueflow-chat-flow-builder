<script setup lang="ts">
import MessageEditor from "./MessageEditor.vue";

defineProps<{
  id: string;
}>();
</script>

<template>
  <Transition name="fade">
    <MessageEditor
      v-if="id !== ''"
      :id="id"
    />
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
