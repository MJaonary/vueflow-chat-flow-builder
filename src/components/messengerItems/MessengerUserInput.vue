<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Handle, Position } from "@vue-flow/core";

// Importing Store Pinia
import { useStore } from "../../stores/main.js";

// Importing SVG icons
import { Trash2 } from "lucide-vue-next";

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

const deleteElement = (id: string) => {
  store.removeMessageItem(props.mid, id);
};
////////////////////////////////////////////.

// Renderless resizable textarea
const textarea = ref<HTMLTextAreaElement | null>(null); // Access the textarea by his ref.

const resizeTextarea = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  target.style.height = "auto";
  target.style.height = target.scrollHeight + 4 + "px";
};

onMounted(() => {
  if (textarea.value) {
    textarea.value.style.height = textarea.value.scrollHeight + 4 + "px";
  }
});
////////////////////////////////////////////.
</script>

<template>
  <div
    v-if="localItems"
    class="relative flex flex-col items-center border-2 border-[#37e7c4] rounded-2xl p-2"
    data-toggle="tooltip"
    data-placement="left"
    title="Messenger User Input"
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
    <div class="font-bold">
      Waiting for User Input
    </div>
    <textarea
      ref="textarea"
      :model-value="(localItems?.description as string | undefined) || ''"
      placeholder="Description"
      class="w-[90%] mt-[0.2rem] overflow-hidden text-center rounded-2xl border-[3px] border-[rgba(113,113,113,0.531)] border-dashed focus:outline-none"
      @input="
        (e) => {
          const value = (e.target as HTMLTextAreaElement).value;
          store.updateItemProperty(props.mid, props.id, 'description', value);
          resizeTextarea(e);
        }
      "
    />
    <!-- Adding image viewer -->

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
