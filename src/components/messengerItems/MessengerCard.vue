<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Handle, Position } from "@vue-flow/core";

// Importing Store Pinia
import { useStore } from "../../stores/main.js";

// Simple Id Generator for basic Usage.
import getId from "../../utils/randomId";

// Importing SVG icons
import { Trash2 } from "lucide-vue-next";

// Local variables and props declaration.
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

const localButtons = computed(() => {
  return localItems.value?.buttons || [];
});

const localDefaultAction = computed<Array<{ id: string; text: string }>>(() => {
  const defaultAction = localItems.value?.default_action;
  return Array.isArray(defaultAction)
    ? (defaultAction as Array<{ id: string; text: string }>)
    : [];
});

const default_image_src_value = computed(() => {
  return store.getDefaultValues.image;
});
////////////////////////////////////////////.

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
  } else if (target.id === props.id + "number") {
    localItems.value.number = target.innerText || "Card Title Comment";
  }
};
////////////////////////////////////////////.

// Elements related methods
const deleteElement = (id: string) => {
  store.removeMessageItem(props.mid, id);
};
////////////////////////////////////////////.

// Buttons related methods.
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

// Default Action related methods.
const insertDefaultAction = () => {
  if (localItems.value) {
    if (!localItems.value.default_action) localItems.value.default_action = [];
    (localItems.value.default_action as Array<{ id: string; text: string }>).push({
      id: getId(),
      text: `Default Action`,
    });
  }
};

const deleteDefaultAction = (id: string) => {
  if (localItems.value) {
    localItems.value.default_action = localDefaultAction.value.filter(
      (element: { id: string }) => element.id !== id,
    );
  }
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
  <div>
    <!-- Card template, Simple And Usable -->
    <div
      v-if="localItems"
      class="relative flex flex-col items-center border-2 border-[#08d2ec] rounded-2xl pb-2"
      data-toggle="tooltip"
      data-placement="left"
      title="Carousel"
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

      <!-- Handle for registering comments -->
      <Handle
        v-if="props.editor === false"
        :id="id + 'right'"
        type="source"
        :position="Position.Right"
      />
      <!-- Handle for registering comments -->

      <!-- Adding image viewer -->
      <img
        :src="
          (localItems.image_url as string | undefined) ||
            default_image_src_value
        "
        class="w-full h-36 object-contain"
      >
      <input
        :id="id + 'image_url'"
        v-model="localItems.image_url"
        type="text"
        class="w-[90%] mt-1 overflow-hidden text-center rounded-2xl border border-border-gray bg-white focus:outline-none"
        placeholder="Enter Image Source here"
      >
      <!-- Adding image viewer -->

      <!-- Title Template -->
      <div
        :id="id + 'title'"
        class="w-[90%] h-fit rounded-2xl mt-[0.2rem] p-2 text-left border-2 border-border-gray inline-block font-bold focus:outline-none"
        contenteditable
        @input="updateValues"
      >
        {{ localItems.title }}
      </div>
      <!-- Title Template -->

      <!-- Subtitle Template -->
      <textarea
        ref="textarea"
        :model-value="(localItems?.subtitle as string | undefined) || ''"
        placeholder="Subtitle"
        class="w-[90%] h-fit rounded-2xl mt-[0.2rem] p-2 text-left border-2 border-border-gray inline-block focus:outline-none"
        @input="
          (e) => {
            if (localItems)
              localItems.subtitle = (e.target as HTMLTextAreaElement).value;
            resizeTextarea(e);
          }
        "
      />
      <!-- Subtitle Template -->

      <!-- Button Poped to request delete element -->
      <div
        class="bg-white w-8 p-0 m-0 rounded-2xl text-[rgba(255,0,0,0.877)] cursor-pointer transition-opacity duration-500 hover:bg-border-gray absolute top-1/2 -right-[2.2rem]"
        :class="{ 'opacity-0': transparent }"
        @click="deleteElement(id)"
      >
        <Trash2 class="w-4 h-4" />
      </div>
      <!-- Button Poped to request delete element -->

      <!-- Default Action template : Insert and render -->
      <!-- Default Action render from localDefaultAction -->
      <div
        v-for="button in localDefaultAction"
        :key="button.id"
        class="flex justify-center items-center border-2 border-dashed border-gray-400 rounded-2xl w-[90%] mt-2 h-12 relative"
      >
        <div>
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
          :class="{ 'opacity-0': transparent }"
          @click="deleteDefaultAction(button.id)"
        >
          <Trash2 class="w-4 h-4" />
        </div>
      </div>
      <!-- Default Action render from localButtons -->
      <div
        v-if="localDefaultAction.length < 1"
        class="flex justify-center items-center border-2 border-dashed border-gray-400 rounded-2xl w-[90%] mt-2 h-12 cursor-pointer hover:bg-border-gray"
        @click="insertDefaultAction"
      >
        Insert Default Action
      </div>
      <!-- Default Action template : Insert and render -->

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
          :class="{ 'opacity-0': transparent }"
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
    <!-- Card template, Simple And Usable -->
  </div>
</template>
