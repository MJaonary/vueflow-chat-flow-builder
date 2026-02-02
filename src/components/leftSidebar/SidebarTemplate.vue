<script setup lang="ts">
import { defineComponent } from "vue";

const props = defineProps<{
  type: string;
  subtitle: string;
  logoColor: string;
  logoComponent: ReturnType<typeof defineComponent>;
}>();

const emit = defineEmits<{
  (e: "open-modal"): void;
}>();

const onDragStart = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData("application/vueflow", props.type);
    event.dataTransfer.effectAllowed = "move";
  }
};

const handleClick = () => {
  if (props.type === "dynamic-node") {
    emit("open-modal");
  }
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center cursor-move bg-white hover:bg-blue-50/50 border border-gray-200 hover:border-blue-300 rounded p-1 transition-all duration-200 group aspect-square w-full"
    :draggable="type !== 'dynamic-node'"
    :title="subtitle"
    @dragstart="onDragStart"
    @click="handleClick"
  >
    <div
      class="flex justify-center items-center w-10 h-10 rounded-md mb-2 shadow-sm transition-transform group-hover:scale-110"
      :style="{ backgroundColor: logoColor || '#7e8c9e' }"
    >
      <component
        :is="logoComponent"
        class="w-5 h-5 text-white"
      />
    </div>
    <div class="text-xs text-center text-card-foreground">
      {{ subtitle }}
    </div>
  </div>
</template>
