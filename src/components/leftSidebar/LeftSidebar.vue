<script setup lang="ts">
import { ref, computed, defineComponent } from "vue";
import SidebarTemplate from "./SidebarTemplate.vue";
import CreateNodeModal from "./CreateNodeModal.vue";
import { useStore } from "../../stores/main";
import getId from "../../utils/randomId";
// Importing SVG icons
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  Image as ImageIcon,
  Square,
  MessageCircle,
  Play,
  Edit2,
  FileText,
  Type as CardText,
  Image as CardImage,
  CreditCard as CardIcon,
  Music as NextAudio,
  Video as VideoIcon,
  Paperclip as Attachment,
  Clock,
  User as UserInput,
  Cloud as CloudIcon,
} from "lucide-vue-next";

const store = useStore();
const showModal = ref(false);

const customNodes = computed(() => {
  if (!store || !Array.isArray(store.getCustomNodes)) return [];
  return store.getCustomNodes;
});

// Define interface locally if not exported from store
interface CustomNode {
  id: string;
  name: string;
  type: string;
  code: string;
  logoColor?: string;
}

const editingNode = ref<CustomNode | null>(null);

const openEditModal = (node: CustomNode) => {
  editingNode.value = node;
  showModal.value = true;
};

const handleCreateNode = (data: { name: string; code: string }) => {
  if (editingNode.value) {
    // Update existing template
    store.updateCustomNode(editingNode.value.id, {
      name: data.name,
      code: data.code,
    });
    editingNode.value = null; // Reset
  } else {
    // Create new template
    const nodeId = getId();
    const nodeType = `custom-${nodeId}`;

    store.addCustomNode({
      id: nodeId,
      name: data.name,
      type: nodeType,
      code: data.code,
      logoColor: "#7e8c9e",
    });
  }

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
    type: "markdown",
    title: "Vue Flow",
    subtitle: "Markdown",
    logoColor: "#6366f1",
    logoComponent: FileText,
  },
  {
    type: "tag",
    title: "Vue Flow",
    subtitle: "Tag",
    logoColor: "#3b82f6",
    logoComponent: Square,
  },
  {
    type: "image",
    title: "Vue Flow",
    subtitle: "Image",
    logoColor: "#0bcb6b",
    logoComponent: ImageIcon,
  },
  {
    type: "starting-step",
    title: "Project",
    subtitle: "Starting Step",
    logoColor: "#6366f1",
    logoComponent: Play,
  },
  {
    type: "message-container",
    title: "Project",
    subtitle: "Send Message",
    logoColor: "#6366f1",
    logoComponent: MessageCircle,
  },
];

const messengerTemplates: Template[] = [
  {
    type: "messenger-text",
    title: "Messenger",
    subtitle: "Text",
    logoColor: "#0084ff",
    logoComponent: CardText,
  },
  {
    type: "messenger-image",
    title: "Messenger",
    subtitle: "Image",
    logoColor: "#0084ff",
    logoComponent: CardImage,
  },
  {
    type: "messenger-card",
    title: "Messenger",
    subtitle: "Card",
    logoColor: "#0084ff",
    logoComponent: CardIcon,
  },
  {
    type: "messenger-audio",
    title: "Messenger",
    subtitle: "Audio",
    logoColor: "#0084ff",
    logoComponent: NextAudio,
  },
  {
    type: "messenger-video",
    title: "Messenger",
    subtitle: "Video",
    logoColor: "#0084ff",
    logoComponent: VideoIcon,
  },
  {
    type: "messenger-file",
    title: "Messenger",
    subtitle: "File",
    logoColor: "#0084ff",
    logoComponent: Attachment,
  },
  {
    type: "messenger-delay",
    title: "Messenger",
    subtitle: "Delay",
    logoColor: "#0084ff",
    logoComponent: Clock,
  },
  {
    type: "messenger-user-input",
    title: "Messenger",
    subtitle: "User Input",
    logoColor: "#0084ff",
    logoComponent: UserInput,
  },
  {
    type: "messenger-dynamic",
    title: "Messenger",
    subtitle: "Dynamic",
    logoColor: "#0084ff",
    logoComponent: CloudIcon,
  },
];
</script>

<template>
  <aside
    ref="sidebarRef"
    class="h-full w-full border-r bg-background overflow-y-auto shadow-sm z-10 relative flex flex-col"
  >
    <!-- Search Bar -->
    <div
      class="px-4 py-3 sticky top-0 bg-background/95 backdrop-blur z-20 border-b"
    >
      <div class="relative w-full items-center">
        <Input
          type="text"
          placeholder="Search components..."
          class="pl-9 h-9 text-sm placeholder:text-xs bg-muted/50 border-transparent hover:bg-muted/80 focus:bg-background transition-colors"
        />
        <span
          class="absolute start-0 inset-y-0 flex items-center justify-center px-3"
        >
          <Search class="w-4 h-4 text-muted-foreground" />
        </span>
      </div>
    </div>

    <Accordion
      type="multiple"
      class="w-full"
      :default-value="['custom', 'messenger', 'general']"
    >
      <AccordionItem
        value="custom"
        class="border-b"
      >
        <AccordionTrigger
          class="px-3 py-2 text-sm font-semibold hover:no-underline hover:bg-secondary/50 transition-colors"
        >
          Custom Nodes
        </AccordionTrigger>
        <AccordionContent class="px-3 py-3">
          <div class="grid grid-cols-3 gap-2">
            <div
              v-for="customNode in customNodes"
              :key="customNode.id"
              class="relative group"
            >
              <SidebarTemplate
                :type="customNode.type"
                :title="'Custom'"
                :subtitle="customNode.name"
                :logo-color="customNode.logoColor || '#7e8c9e'"
                :logo-component="Square"
              />
              <button
                class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 bg-background/80 backdrop-blur hover:bg-background rounded-md shadow-sm border border-border transition-all"
                @click.stop="openEditModal(customNode)"
              >
                <Edit2 class="w-3.5 h-3.5 text-foreground/70" />
              </button>
            </div>

            <!-- Create New Node Button -->
            <button
              class="h-28 w-full flex flex-col items-center justify-center gap-2 p-4 border border-dashed border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-200 group"
              @click="showModal = true"
            >
              <div
                class="h-10 w-10 rounded-lg bg-background border shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
              >
                <span class="text-xl font-medium">+</span>
              </div>
              <div class="flex flex-col items-center">
                <span class="text-xs font-medium">New</span>
                <span class="text-[10px] opacity-70">Vue Code</span>
              </div>
            </button>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem
        value="general"
        class="border-b"
      >
        <AccordionTrigger
          class="px-3 py-2 text-sm font-semibold hover:no-underline hover:bg-secondary/50 transition-colors"
        >
          General
        </AccordionTrigger>
        <AccordionContent class="px-2 py-2">
          <div class="grid grid-cols-3 gap-2">
            <SidebarTemplate
              v-for="template in templates"
              :key="template.type"
              v-bind="template"
              @open-modal="showModal = true"
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem
        value="messenger"
        class="border-b"
      >
        <AccordionTrigger
          class="px-3 py-2 text-sm font-semibold hover:no-underline hover:bg-secondary/50 transition-colors"
        >
          Message Items
        </AccordionTrigger>
        <AccordionContent class="px-2 py-2">
          <div class="grid grid-cols-3 gap-2">
            <SidebarTemplate
              v-for="template in messengerTemplates"
              :key="template.type"
              v-bind="template"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>

    <CreateNodeModal
      :show="showModal"
      :initial-data="editingNode"
      @close="showModal = false"
      @submit="handleCreateNode"
    />
  </aside>
</template>
