<script setup lang="ts">
import { ref, computed } from "vue";
import { Handle, Position } from "@vue-flow/core";

// Importing Store Pinia
import { useStore } from "../../stores/main.js";

// Importing SVG icons
import { Trash2, Clock } from "lucide-vue-next";

// Local variables and props declaration
const transparent = ref(true);
const props = defineProps<{
  mid: string;
  id: string;
  editor: boolean;
}>();
////////////////////////////////////////////.

// Usage of Store Pinia
const store = useStore();

// Computed Values from Store
const localItems = computed(() => {
  return store.getItemById(props.mid, props.id);
});
////////////////////////////////////////////.

// Elements related methods
const deleteElement = (id: string) => {
  store.removeMessageItem(props.mid, id);
};
////////////////////////////////////////////.
</script>

<template>
  <div
    v-if="localItems"
    class="relative flex flex-col items-center border-2 border-[#db0d66] rounded-2xl pb-2"
    data-toggle="tooltip"
    data-placement="left"
    title="Messenger Delay"
    @mouseenter="transparent = false"
    @mouseleave="transparent = true"
  >
    <!-- Handle for registering comments -->
    <Handle
      v-if="props.editor === false"
      :id="id + 'comment'"
      type="target"
      :position="Position.Left"
    />
    <!-- Handle for registering comments -->

    <!-- Adding image viewer -->
    <Clock class="w-8 h-8 mt-2 text-primary" />
    <!-- Adding image viewer -->

    <input
      v-model.number="localItems.delay_to_wait"
      type="number"
      min="0"
      step="1"
      class="w-[90%] mt-1 overflow-hidden text-center rounded-2xl border border-border-gray bg-white focus:outline-none"
      placeholder="Enter Delay in milliseconds"
    >

    <!-- Button Poped to request delete element -->
    <div
      class="bg-white w-8 p-0 m-0 rounded-2xl text-[rgba(255,0,0,0.877)] cursor-pointer transition-opacity duration-500 hover:bg-border-gray absolute top-1/2 -right-[2.2rem]"
      :class="{ 'opacity-0': transparent }"
      @click="deleteElement(id)"
    >
      <Trash2 class="w-4 h-4" />
    </div>
    <!-- Button Poped to request delete element -->
  </div>
</template>
