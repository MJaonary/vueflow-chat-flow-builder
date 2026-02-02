<script setup lang="ts">
import { ref, computed } from "vue";
import { Handle, Position } from "@vue-flow/core";

// Importing Store Pinia
import { useStore } from "../../stores/main";

// Simple Id Generator for basic Usage.
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

const localItems = computed(() => {
  return store.getItemById(props.mid, props.id);
});

const localButtons = computed(() => {
  return localItems.value?.buttons || [];
});

const default_image_src_value = computed(() => {
  return store.getDefaultValues.image;
});

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
  } else if (target.id === props.id + "number") {
    localItems.value.number = target.innerText || "Card Image Comment";
  }
};

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
////////////////////////////////////////////.
</script>

<template>
  <div>
    <div
      v-if="localItems"
      class="relative flex flex-col items-center border-2 border-indigo-500 rounded-2xl pb-2"
      data-toggle="tooltip"
      data-placement="left"
      title="Video"
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
      <img
        v-show="!localItems.video_url"
        :src="default_image_src_value"
        alt="Video thumbnail"
        class="rounded-2xl w-[94%] h-36 object-contain mt-[0.2rem]"
      >
      <video
        v-show="localItems.video_url"
        :src="(localItems.video_url as string | undefined) || ''"
        muted
        controls
        class="rounded-2xl w-[94%] h-36 object-contain mt-[0.2rem]"
      />

      <input
        v-model="localItems.video_url"
        type="text"
        placeholder="Enter Source here"
        class="w-[90%] mt-1 overflow-hidden text-center rounded-2xl border-border-gray bg-white focus:outline-none"
      >
      <!-- Adding image viewer -->

      <div class="text-[12px] text-gray-400 mt-1">
        Audio URL or Attachment ID
      </div>
      <input
        v-model="localItems.link"
        type="text"
        placeholder="Enter Source here"
        class="w-[90%] mt-1 overflow-hidden text-center rounded-2xl border-border-gray bg-white focus:outline-none"
      >

      <!-- Button Poped to request delete element -->
      <div
        class="bg-white w-8 p-0 m-0 rounded-2xl text-red-500 cursor-pointer transition-opacity duration-500 hover:bg-border-gray absolute top-1/2 -right-[2.2rem]"
        :class="{ 'opacity-0': transparent }"
        @click="deleteElement(id)"
      >
        <Trash2 class="w-4 h-4" />
      </div>
      <!-- Button Poped to request delete element -->

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
            (event) => {
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
        v-if="localButtons.length < 1"
        class="flex justify-center items-center border-2 border-dashed border-gray-400 rounded-2xl w-[90%] mt-2 h-12 cursor-pointer hover:bg-border-gray"
        @click="insertButton"
      >
        Insert Button
      </div>
      <!-- Button template : Insert and render -->
    </div>
  </div>
</template>
