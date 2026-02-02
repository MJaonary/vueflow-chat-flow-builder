<script setup lang="ts">
import { ref, computed } from "vue";
import { Handle, Position } from "@vue-flow/core";

// Importing Store Pinia
import { useStore } from "../../stores/main.js";

// Importing SVG icons
import { Trash2, Music } from "lucide-vue-next";

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

const localItems = computed(() => {
  return store.getItemById(props.mid, props.id);
});
const deleteElement = (id: string) => {
  store.removeMessageItem(props.mid, id);
};
////////////////////////////////////////////.
</script>

<template>
  <div
    v-if="localItems"
    class="relative flex flex-col items-center border-2 border-[#dbd40d] rounded-2xl pb-2"
    data-toggle="tooltip"
    data-placement="left"
    title="Messenger Audio"
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
    <Music class="w-8 h-8 mt-1 text-primary" />
    <input
      v-model="localItems.title"
      type="text"
      placeholder="Enter Audio Title"
      class="w-[90%] mt-1 overflow-hidden text-center rounded-2xl border-border-gray bg-white focus:outline-none"
    >
    <!-- Adding image viewer -->

    <input
      v-model="localItems.link"
      type="text"
      placeholder="Audio URL or Attachment ID"
      class="w-[90%] mt-1 overflow-hidden text-center rounded-2xl border-border-gray bg-white focus:outline-none"
    >
    <div class="text-[12px] text-gray-400 mt-1">
      Audio URL or Attachment ID
    </div>

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
