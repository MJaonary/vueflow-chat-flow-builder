<script setup lang="ts">
import { ref, computed, defineComponent } from "vue";
import SidebarTemplate from "./SidebarTemplate.vue";

defineOptions({
  name: "SidebarComponent",
});
import CreateNodeModal from "./CreateNodeModal.vue";
import { useStore } from "../../stores/main";
import getId from "../../utils/randomId";

// Importing SVG icons
import {
  Image as ImageIcon,
  Square,
  MessageCircle,
  Play,
} from "lucide-vue-next";

const store = useStore();
const showModal = ref(false);

const customNodes = computed(() => {
  if (!store || !Array.isArray(store.getCustomNodes)) return [];
  return store.getCustomNodes;
});

const handleCreateNode = (data: { name: string; code: string }) => {
  const nodeId = getId();
  const nodeType = `custom-${nodeId}`;

  store.addCustomNode({
    id: nodeId,
    name: data.name,
    type: nodeType,
    code: data.code,
    logoColor: "#7e8c9e",
  });

  showModal.value = false;
};

interface Template {
  type: string;
  title: string;
  subtitle: string;
  logoColor: string;
  logoComponent: ReturnType<typeof defineComponent>;
}

const templates: Template[] = [
  {
    type: "image",
    title: "Vue Flow",
    subtitle: "Image",
    logoColor: "#0bcb6b",
    logoComponent: ImageIcon,
  },
  {
    type: "starting-step",
    title: "Facebook",
    subtitle: "Starting Step",
    logoColor: "#0bcb6b",
    logoComponent: Play,
  },
  {
    type: "message-container",
    title: "Message Container", // Assuming "branding strings" refers to title/subtitle
    subtitle: "Message Container", // Assuming "branding strings" refers to title/subtitle
    logoColor: "",
    logoComponent: MessageCircle,
  },
  {
    type: "dynamic-node",
    title: "Vue Flow",
    subtitle: "Dynamic Node",
    logoColor: "#354a03",
    logoComponent: Square,
  },
];
</script>

<template>
  <aside>
    <h1 class="mt-2 text-base font-bold">
      Flowchart Basic Nodes
    </h1>
    <div
      class="border-t border-border-gray flex flex-col justify-center items-center"
    >
      <SidebarTemplate
        v-for="template in templates"
        :key="template.type"
        v-bind="template"
        @open-modal="showModal = true"
      />
      <!-- Custom Nodes -->
      <SidebarTemplate
        v-for="customNode in customNodes"
        :key="customNode.id"
        :type="customNode.type"
        :title="'Custom'"
        :subtitle="customNode.name"
        :logo-color="customNode.logoColor || '#7e8c9e'"
        :logo-component="Square"
      />
    </div>

    <CreateNodeModal
      :show="showModal"
      @close="showModal = false"
      @submit="handleCreateNode"
    />
  </aside>
</template>
