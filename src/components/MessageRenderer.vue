<script setup lang="ts">
import { computed, type Component } from "vue";
import { useStore } from "../stores/main";

import MessengerText from "./messengerItems/MessengerText.vue";
import MessengerCard from "./messengerItems/MessengerCard.vue";
import MessengerImage from "./messengerItems/MessengerImage.vue";
import MessengerAudio from "./messengerItems/MessengerAudio.vue";
import MessengerVideo from "./messengerItems/MessengerVideo.vue";
import MessengerFile from "./messengerItems/MessengerFile.vue";
import MessengerDelay from "./messengerItems/MessengerDelay.vue";
import MessengerUserInput from "./messengerItems/MessengerUserInput.vue";
import MessengerDynamic from "./messengerItems/MessengerDynamic.vue";

const props = defineProps<{
  id: string;
  editor?: boolean;
}>();

const store = useStore();

const localStates = computed(() => {
  return store.getMessageById(props.id);
});

const localItems = computed(() => {
  return localStates.value?.items || [];
});

const componentsMap: Record<string, Component> = {
  messengerTextVue: MessengerText,
  messengerCardVue: MessengerCard,
  messengerImageVue: MessengerImage,
  messengerAudioVue: MessengerAudio,
  messengerVideoVue: MessengerVideo,
  messengerFileVue: MessengerFile,
  messengerDelayVue: MessengerDelay,
  messengerUserInputVue: MessengerUserInput,
  messengerDynamicVue: MessengerDynamic,
};
</script>

<template>
  <component
    :is="item.type ? componentsMap[item.type] : null"
    v-for="item in localItems"
    :id="item.id"
    :key="item.id"
    :mid="id"
    :editor="props.editor"
  />
</template>
