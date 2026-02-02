<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Handle, Position } from "@vue-flow/core";

// Importing Store Pinia
import { useStore } from "../../stores/main.js";

// Simple Id Generator for basic Usage
import getId from "../../utils/randomId";

// Importing SVG icons
import { Trash2 } from "lucide-vue-next";

// Local variables and props declaration
const transparent = ref(true);
const props = defineProps<{
  mid: string;
  id: string;
  editor: boolean;
}>();

// Usage of Store Pinia
const store = useStore();

// Computed Values from Store
const localItems = computed(() => {
  return store.getItemById(props.mid, props.id);
});

const localButtons = computed(() => {
  return localItems.value?.buttons || [];
});

// Value update related methods are defined here
const updateValues = (event: Event, button_id?: string) => {
  const target = event.target as HTMLElement;
  if (!localItems.value) return;

  if (button_id && target.id === button_id + "button") {
    const button = localButtons.value.find(
      (element) => element.id === button_id,
    );
    if (button) {
      button.text = target.innerText || "Enter Text";
    }
  }
};

// Elements related methods
const deleteElement = (id: string) => {
  store.removeMessageItem(props.mid, id);
};

// Buttons related methods
const deleteButton = (id: string) => {
  if (localItems.value) {
    localItems.value.buttons = localButtons.value.filter(
      (element: { id: string }) => element.id !== id,
    );
  }
};

const insertButton = () => {
  if (localItems.value) {
    if (!localItems.value.buttons) localItems.value.buttons = [];
    localItems.value.buttons.push({
      id: getId(),
      text: `New Button ${localButtons.value.length + 1}`,
    });
  }
};

// Renderless resizable textarea
const textarea = ref<HTMLTextAreaElement | null>(null);

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
    class="relative flex flex-col justify-center items-center border-2 border-[#43ce0c] rounded-2xl pb-2"
    data-toggle="tooltip"
    data-placement="left"
    title="Messenger Text and Buttons"
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

    <textarea
      v-if="localItems"
      ref="textarea"
      v-model="localItems.text"
      class="w-full whitespace-normal bg-[#e5e5e5] border border-[#e5e5e5] text-black px-3 py-1.5 box-border overflow-hidden overflow-wrap-break-word inline-block rounded-[1em] text-left"
      :class="{ 'rounded-bl-0 rounded-br-0 mb-0': localButtons.length > 0 }"
      @input="resizeTextarea"
    />

    <!-- Button Poped to request delete element -->
    <div
      class="bg-white w-8 p-0 m-0 rounded-2xl text-[rgba(255,0,0,0.877)] cursor-pointer transition-opacity duration-500 hover:bg-border-gray absolute top-1/2 -right-[2.2rem]"
      :class="{ 'opacity-0': transparent }"
      @click="deleteElement(id)"
    >
      <Trash2 class="w-4 h-4" />
    </div>
    <!-- Button Poped to request delete element -->

    <div class="flex flex-col justify-center items-center w-full">
      <!-- Button template : Insert and render -->
      <!-- Button render from localButtons -->
      <div
        v-for="button in localButtons"
        :key="button.id"
        class="flex justify-center items-center border-2 border-dashed border-gray-400 rounded-2xl w-[90%] mt-2 h-12 relative"
      >
        <div
          :id="button.id + 'button'"
          contenteditable="true"
          class="focus:outline-none"
          @input="
            (event: Event) => {
              updateValues(event, button.id);
            }
          "
        >
          {{ button.text }}
        </div>
        <Handle
          v-if="props.editor === false"
          :id="button.id + 'right'"
          type="source"
          :position="Position.Right"
        />
        <div
          class="bg-white w-8 p-0 m-0 rounded-2xl text-[rgba(255,0,0,0.877)] cursor-pointer transition-opacity duration-500 hover:bg-border-gray absolute right-0"
          @click="deleteButton(button.id)"
        >
          <Trash2 class="w-4 h-4" />
        </div>
      </div>
      <!-- Button render from localButtons -->
      <div
        v-if="localButtons.length < 3"
        class="flex justify-center items-center border-2 border-dashed border-gray-400 rounded-2xl w-[90%] mt-2 h-12 cursor-pointer hover:bg-border-gray"
        @click="insertButton"
      >
        Insert Button
      </div>
      <!-- Button template : Insert and render -->
    </div>
  </div>
</template>
