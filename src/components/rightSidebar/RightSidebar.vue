<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStore } from "@/stores/main";

const props = defineProps<{
  id: string;
}>();

const store = useStore();

const selectedNode = computed(() => {
  if (!props.id) return undefined;
  return store.getMessageById(props.id);
});

// Dynamic editor resolution
const editors: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  "message-container": defineAsyncComponent(
    () => import("./editors/MessageContainerEditor.vue"),
  ),
  ImageEditor: defineAsyncComponent(() => import("./editors/ImageEditor.vue")),
  TagEditor: defineAsyncComponent(() => import("./editors/TagEditor.vue")),
  MarkdownEditor: defineAsyncComponent(
    () => import("./editors/MarkdownEditor.vue"),
  ),
  CustomNodeInfo: defineAsyncComponent(
    () => import("./editors/CustomNodeInfo.vue"),
  ),
  FallbackEditor: defineAsyncComponent(
    () => import("./editors/FallbackEditor.vue"),
  ),
};

const activeEditor = computed(() => {
  if (!props.id || !selectedNode.value) return editors.FallbackEditor;
  const editorName = selectedNode.value.editor;
  return editorName && editors[editorName]
    ? editors[editorName]
    : editors.FallbackEditor;
});
</script>

<template>
  <div class="h-full w-full border-l flex flex-col bg-background shadow-xl">
    <Tabs
      default-value="editor"
      class="flex-1 flex flex-col"
    >
      <div class="px-2 pt-2">
        <TabsList class="w-full grid grid-cols-2 h-9">
          <TabsTrigger
            value="editor"
            class="text-xs"
          >
            Editor
          </TabsTrigger>
          <TabsTrigger
            value="style"
            class="text-xs"
          >
            Style
          </TabsTrigger>
        </TabsList>
      </div>

      <ScrollArea class="flex-1">
        <TabsContent
          value="editor"
          class="m-0 p-0 h-full flex flex-col"
        >
          <component
            :is="activeEditor"
            :id="id"
            :key="id"
          />
        </TabsContent>

        <TabsContent
          value="style"
          class="m-0 p-4"
        >
          <div class="text-left text-muted-foreground text-xs">
            Style settings coming soon.
          </div>
        </TabsContent>
      </ScrollArea>
    </Tabs>
  </div>
</template>
