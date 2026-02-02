<script setup lang="ts">
import MessageEditor from "@/components/MessageEditor.vue";

defineProps<{
  id: string;
}>();
</script>

<template>
  <div class="h-full w-full">
    <MessageEditor
      :id="id"
      :key="id"
    />
  </div>
</template>
