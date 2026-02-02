<script setup lang="ts">
import { computed, type Component } from "vue";
import MessengerText from "./messengerItems/MessengerText.vue";
import MessengerCard from "./messengerItems/MessengerCard.vue";
import MessengerImage from "./messengerItems/MessengerImage.vue";
import MessengerAudio from "./messengerItems/MessengerAudio.vue";
import MessengerVideo from "./messengerItems/MessengerVideo.vue";
import MessengerFile from "./messengerItems/MessengerFile.vue";
import MessengerDelay from "./messengerItems/MessengerDelay.vue";
import MessengerUserInput from "./messengerItems/MessengerUserInput.vue";
import MessengerDynamic from "./messengerItems/MessengerDynamic.vue";

// Simple Id Generator for basic Usage.
import getId from "../utils/randomId";

// Importing SVG icons
import {
  Type as CardText,
  Image as CardImage,
  CreditCard as CardIcon,
  Images as GalleryIcon,
  Music as NextAudio,
  Video as VideoIcon,
  Paperclip as Attachment,
  Clock,
  User as UserInput,
  Cloud as CloudIcon,
} from "lucide-vue-next";

// Usage of Store Pinia
import { useStore } from "../stores/main.js";
const store = useStore();

const props = defineProps<{
  id: string;
}>();

// Computed Values from Store.
const localStates = computed(() => {
  return store.getMessageById(props.id);
});

const localItems = computed(() => {
  return localStates.value?.items || [];
});

// Component map for rendering items
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

// Method for adding element to the message editor
const addElement = (type: string) => {
  let element:
    | {
        id: string;
        type: string;
        [key: string]: unknown;
      }
    | undefined;
  try {
    switch (type) {
      case "messengerTextVue":
        element = {
          id: getId(),
          type: "messengerTextVue",
          text: "Entre le Message",
          buttons: [],
        };
        break;

      case "messengerImageVue":
        element = {
          id: getId(),
          type: "messengerImageVue",
          number: "Card Image Comment",
          image_url: "",
          link: "",
          buttons: [],
        };
        break;

      case "messengerCardVue":
        element = {
          id: getId(),
          type: "messengerCardVue",
          number: "Card Comment",
          image_url: "",
          title: "Title",
          subtitle: "Subtitle",
          default_action: [],
          buttons: [],
        };
        break;

      case "messengerAudioVue":
        element = {
          id: getId(),
          type: "messengerAudioVue",
          title: "",
          link: "",
        };
        break;

      case "messengerVideoVue":
        element = {
          id: getId(),
          type: "messengerVideoVue",
          number: "Card Video Comment",
          video_url: "",
          link: "",
          buttons: [],
        };
        break;

      case "messengerFileVue":
        element = {
          id: getId(),
          type: "messengerFileVue",
          file_url: "",
          link: "",
        };
        break;

      case "messengerDelayVue":
        element = {
          id: getId(),
          type: "messengerDelayVue",
          delay_to_wait: "",
        };
        break;

      case "messengerUserInputVue":
        element = {
          id: getId(),
          type: "messengerUserInputVue",
          description: "",
        };
        break;

      case "messengerDynamicVue":
        element = {
          id: getId(),
          type: "messengerDynamicVue",
          description: "",
        };
        break;

      default:
        return;
    }

    if (localStates.value && element) {
      if (!localStates.value.items) localStates.value.items = [];
      localStates.value.items.push(element);
    }
  } catch (error) {
    console.error(error);
  }
};

</script>

<template>
  <div
    class="flex flex-col absolute top-[2.2%] right-0 max-w-[22rem] rounded-2xl h-[95%] z-[999] bg-white"
    style="box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px"
  >
    <div class="h-full overflow-y-auto overflow-x-hidden">
      <div class="flex flex-col justify-center m-[2%] p-[2%]">
        <div
          v-for="item in localItems"
          :id="item.id"
          :key="item.id"
        >
          <component
            :is="item.type ? componentsMap[item.type] : null"
            :id="item.id"
            :mid="id"
            :editor="true"
          />
        </div>
      </div>
      <div class="flex justify-center flex-wrap mb-4 p-0 rounded-2xl h-[28rem]">
        <div
          class="flex justify-start items-center border-[3px] border-dashed border-[#7678797e] rounded-2xl w-[46%] p-0 m-[1%] text-[#303030ae] text-left cursor-pointer hover:bg-[rgba(238,238,238,0.653)] active:bg-[rgba(201,199,199,0.856)]"
          @click="addElement('messengerTextVue')"
        >
          <div
            class="flex justify-center items-center border-r-[3px] border-r-dashed border-r-[#7678797e] mr-4 pl-2 h-full w-[30%]"
          >
            <CardText class="w-8 h-8 text-black opacity-60 mr-[0.4rem]" />
          </div>
          <div>Text</div>
        </div>
        <div
          class="flex justify-start items-center border-[3px] border-dashed border-[#7678797e] rounded-2xl w-[46%] p-0 m-[1%] text-[#303030ae] text-left cursor-pointer hover:bg-[rgba(238,238,238,0.653)] active:bg-[rgba(201,199,199,0.856)]"
          @click="addElement('messengerImageVue')"
        >
          <div
            class="flex justify-center items-center border-r-[3px] border-r-dashed border-r-[#7678797e] mr-4 pl-2 h-full w-[30%]"
          >
            <CardImage class="w-8 h-8 text-black opacity-60 mr-[0.4rem]" />
          </div>
          <div>Image</div>
        </div>
        <div
          class="flex justify-start items-center border-[3px] border-dashed border-[#7678797e] rounded-2xl w-[46%] p-0 m-[1%] text-[#303030ae] text-left cursor-pointer hover:bg-[rgba(238,238,238,0.653)] active:bg-[rgba(201,199,199,0.856)]"
          @click="addElement('messengerCardVue')"
        >
          <div
            class="flex justify-center items-center border-r-[3px] border-r-dashed border-r-[#7678797e] mr-4 pl-2 h-full w-[30%]"
          >
            <CardIcon
              class="w-8 h-8 text-black opacity-60 mr-[0.4rem] scale-[1.75] p-[5px_0px_5px_5px]"
            />
          </div>
          <div>Card</div>
        </div>
        <div
          class="flex justify-start items-center border-[3px] border-dashed border-[#7678797e] rounded-2xl w-[46%] p-0 m-[1%] text-[#303030ae] text-left cursor-pointer hover:bg-[rgba(238,238,238,0.653)] active:bg-[rgba(201,199,199,0.856)]"
          @click="addElement('messengerCardVue')"
        >
          <div
            class="flex justify-center items-center border-r-[3px] border-r-dashed border-r-[#7678797e] mr-4 pl-2 h-full w-[30%]"
          >
            <GalleryIcon
              class="w-8 h-8 text-black opacity-60 mr-[0.4rem] scale-[1.75] p-[6px_0px_6px_5px]"
            />
          </div>
          <div>Gallery</div>
        </div>
        <div
          class="flex justify-start items-center border-[3px] border-dashed border-[#7678797e] rounded-2xl w-[46%] p-0 m-[1%] text-[#303030ae] text-left cursor-pointer hover:bg-[rgba(238,238,238,0.653)] active:bg-[rgba(201,199,199,0.856)]"
          @click="addElement('messengerAudioVue')"
        >
          <div
            class="flex justify-center items-center border-r-[3px] border-r-dashed border-r-[#7678797e] mr-4 pl-2 h-full w-[30%]"
          >
            <NextAudio class="w-8 h-8 text-black opacity-60 mr-[0.4rem]" />
          </div>
          <div>Audio</div>
        </div>
        <div
          class="flex justify-start items-center border-[3px] border-dashed border-[#7678797e] rounded-2xl w-[46%] p-0 m-[1%] text-[#303030ae] text-left cursor-pointer hover:bg-[rgba(238,238,238,0.653)] active:bg-[rgba(201,199,199,0.856)]"
          @click="addElement('messengerVideoVue')"
        >
          <div
            class="flex justify-center items-center border-r-[3px] border-r-dashed border-r-[#7678797e] mr-4 pl-2 h-full w-[30%]"
          >
            <VideoIcon
              class="w-8 h-8 text-black opacity-60 mr-[0.4rem] scale-125 p-[4px_0px_4px_2px]"
            />
          </div>
          <div>Video</div>
        </div>
        <div
          class="flex justify-start items-center border-[3px] border-dashed border-[#7678797e] rounded-2xl w-[46%] p-0 m-[1%] text-[#303030ae] text-left cursor-pointer hover:bg-[rgba(238,238,238,0.653)] active:bg-[rgba(201,199,199,0.856)]"
          @click="addElement('messengerFileVue')"
        >
          <div
            class="flex justify-center items-center border-r-[3px] border-r-dashed border-r-[#7678797e] mr-4 pl-2 h-full w-[30%]"
          >
            <Attachment
              class="w-8 h-8 text-black opacity-60 mr-[0.4rem] scale-[1.35] p-[6px_0px_6px_5px]"
            />
          </div>
          <div>File</div>
        </div>
        <div
          class="flex justify-start items-center border-[3px] border-dashed border-[#7678797e] rounded-2xl w-[46%] p-0 m-[1%] text-[#303030ae] text-left cursor-pointer hover:bg-[rgba(238,238,238,0.653)] active:bg-[rgba(201,199,199,0.856)]"
          @click="addElement('messengerDelayVue')"
        >
          <div
            class="flex justify-center items-center border-r-[3px] border-r-dashed border-r-[#7678797e] mr-4 pl-2 h-full w-[30%]"
          >
            <Clock class="w-8 h-8 text-black opacity-60 mr-[0.4rem]" />
          </div>
          <div>Delay</div>
        </div>
        <div
          class="flex justify-start items-center border-[3px] border-dashed border-[#7678797e] rounded-2xl w-[46%] p-0 m-[1%] text-[#303030ae] text-left cursor-pointer hover:bg-[rgba(238,238,238,0.653)] active:bg-[rgba(201,199,199,0.856)]"
          @click="addElement('messengerUserInputVue')"
        >
          <div
            class="flex justify-center items-center border-r-[3px] border-r-dashed border-r-[#7678797e] mr-4 pl-2 h-full w-[30%]"
          >
            <UserInput
              class="w-8 h-8 text-black opacity-60 mr-[0.4rem] scale-[1.75] p-[7px_0px_6px_5px]"
            />
          </div>
          <div>User Input</div>
        </div>
        <div
          class="flex justify-start items-center border-[3px] border-dashed border-[#7678797e] rounded-2xl w-[46%] p-0 m-[1%] text-[#303030ae] text-left cursor-pointer hover:bg-[rgba(238,238,238,0.653)] active:bg-[rgba(201,199,199,0.856)]"
          @click="addElement('messengerDynamicVue')"
        >
          <div
            class="flex justify-center items-center border-r-[3px] border-r-dashed border-r-[#7678797e] mr-4 pl-2 h-full w-[30%]"
          >
            <CloudIcon class="w-8 h-8 text-black opacity-60 mr-[0.4rem]" />
          </div>
          <div>Dynamic</div>
        </div>
      </div>
    </div>
  </div>
</template>
