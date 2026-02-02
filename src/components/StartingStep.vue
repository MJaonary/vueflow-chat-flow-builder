<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Handle, Position } from "@vue-flow/core";

// Importing Store Pinia
import { useStore } from "../stores/main.js";

// Simple Id Generator for basic Usage
import getId from "../utils/randomId.js";

// Importing SVG icons
import { Trash2, Play } from "lucide-vue-next";

// Local variables and props declaration
let selectedColor = ref(false);
const props = defineProps<{
  id: string;
  selected: boolean;
}>();
////////////////////////////////////////////.

// Usage of Store Pinia
const store = useStore();

// Computed Values from Store
const localStates = computed(() => {
  return store.getMessageById(props.id);
});

const localItems = computed(() => {
  return localStates.value?.items || [];
});
////////////////////////////////////////////.

// Items related methods
const deleteItemId = (id: string) => {
  if (localStates.value) {
    localStates.value.items = localItems.value.filter(
      (element: { id: string }) => {
        return element.id !== id;
      },
    );
  }
};

const addItem = () => {
  if (localStates.value) {
    if (!localStates.value.items) localStates.value.items = [];
    localStates.value.items.push({ id: getId(), keyword: "Enter Keywords" });
  }
};
////////////////////////////////////////////.

// Value update related methods are defined here
const updateValues = (event: Event, id?: string) => {
  const target = event.target as HTMLElement;
  if (!localStates.value) return;

  if (target.id === props.id + "type") {
    localStates.value.content = target.innerText;
  } else if (id && target.id === id + "items") {
    const item = localStates.value.items?.find(
      (element: { id: string }) => element.id === id,
    );
    if (item) {
      item.keyword = target.innerText;
    }
  }
};
////////////////////////////////////////////.

// Watching Selected Manual event
watch(
  () => props.selected,
  (isSelected) => (selectedColor.value = isSelected),
);
////////////////////////////////////////////.
</script>

<template>
  <Handle
    :id="id + 'right'"
    type="target"
    :position="Position.Right"
  />
  <Handle
    :id="id + 'bottom'"
    type="source"
    :position="Position.Bottom"
  />

  <div
    class="flex flex-col items-center"
    :style="{ borderColor: selectedColor ? 'red' : '' }"
  >
    <div
      v-if="localStates"
      class="flex justify-center items-center absolute left-1/2 -translate-x-1/2 -translate-y-full px-4 py-[5px] clear-left w-full border-2 border-b-transparent rounded-t-2xl bg-white p-0 cursor-move"
    >
      <input
        v-model="localStates.label"
        type="text"
        class="w-[calc(100%-1rem)] m-[0.2rem] p-0 outline-transparent border-transparent text-center cursor-move"
      >
    </div>

    <div
      class="max-w-[calc(18rem+6px)] -mt-px border-2 border-t-0 rounded-b-2xl hover:border-[#0bcb6b] hover:rounded-b-2xl shadow-md"
    >
      <div
        class="bg-white w-72 h-12 text-base text-left pl-2 pt-[0.3rem] border-b border-border-gray"
      >
        <div class="flex items-center">
          <div
            class="flex justify-center items-center bg-indigo-500 text-white rounded-full w-8 h-8"
          >
            <Play class="w-4 h-4 fill-current" />
          </div>
          <div class="p-2">
            Starting Step
          </div>
        </div>
      </div>
      <div class="bg-white px-4 py-2 w-full rounded-b-2xl cursor-pointer">
        <div
          v-if="localStates"
          :id="id + 'type'"
          class="text-left rounded-2xl p-[0.4rem] focus:outline-[3px] focus:outline-[#e1faec]"
          contenteditable="true"
          @input="updateValues"
        >
          {{ localStates.content }}
        </div>
        <div
          v-for="item in localItems"
          :key="item.id"
          class="flex justify-center items-center border border-[#e1faec] rounded-[10px] p-[0.8rem] text-gray-600 m-[0.4rem] bg-[#e1faec] relative"
        >
          <div
            :id="item.id + 'items'"
            class="w-11/12 focus:outline-[3px] focus:outline-[#e1faec]"
            contenteditable="true"
            @input="
              ($event) => {
                updateValues($event, item.id);
              }
            "
          >
            {{ item.keyword }}
          </div>
          <Handle
            :id="item.id + 'right'"
            type="source"
            :position="Position.Right"
          />
          <div
            class="text-danger cursor-pointer"
            @click="deleteItemId(item.id)"
          >
            <Trash2 class="w-4 h-4" />
          </div>
        </div>
        <div
          class="border border-dashed border-gray-600 rounded-[5px] p-[0.8rem] text-gray-600 m-[0.4rem] hover:bg-border-gray hover:text-messenger-blue active:cursor-grabbing"
          @click="addItem()"
        >
          Add Triggers
        </div>
      </div>
    </div>
  </div>
</template>
