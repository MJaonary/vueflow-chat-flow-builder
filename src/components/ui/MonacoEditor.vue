<script setup lang="ts">
import {
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
  shallowRef,
} from "vue";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

// Configure Monaco workers once (best practice: don't reassign on every component instance)
if (!globalThis.MonacoEnvironment) {
  globalThis.MonacoEnvironment = {
    getWorker(_: unknown, label: string): Worker {
      if (label === "json") return new (jsonWorker as new () => Worker)();
      if (label === "css" || label === "scss" || label === "less")
        return new (cssWorker as new () => Worker)();
      if (label === "html" || label === "handlebars" || label === "razor")
        return new (htmlWorker as new () => Worker)();
      if (label === "typescript" || label === "javascript")
        return new (tsWorker as new () => Worker)();
      return new (editorWorker as new () => Worker)();
    },
  };
}

const props = defineProps<{
  modelValue: string;
  language?: string;
  theme?: string;
  readOnly?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const editorContainer = ref<HTMLElement | null>(null);
const editor = shallowRef<monaco.editor.IStandaloneCodeEditor | null>(null);
const model = shallowRef<monaco.editor.ITextModel | null>(null);
let contentListener: monaco.IDisposable | null = null;
let isApplyingExternalValue = false;
let resizeObserver: ResizeObserver | null = null;

const getLanguage = () => props.language || "html";
const getTheme = () => props.theme || "vs-dark";

const applyExternalValue = (nextValue: string) => {
  const ed = editor.value;
  const m = model.value;
  if (!ed || !m) return;

  const current = m.getValue();
  if (nextValue === current) return;

  // Best practice for "controlled" Monaco: avoid setValue() (resets undo stack)
  // Use executeEdits() + undo stops to preserve undo/redo behavior.
  const selection = ed.getSelection();
  const fullRange = m.getFullModelRange();
  isApplyingExternalValue = true;
  ed.pushUndoStop();
  ed.executeEdits("vue-monaco-editor", [
    { range: fullRange, text: nextValue, forceMoveMarkers: true },
  ]);
  ed.pushUndoStop();
  if (selection) ed.setSelection(selection);
  isApplyingExternalValue = false;
};

onMounted(() => {
  if (editorContainer.value) {
    monaco.editor.setTheme(getTheme());
    model.value = monaco.editor.createModel(
      props.modelValue || "",
      getLanguage(),
    );

    editor.value = monaco.editor.create(editorContainer.value, {
      model: model.value,
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 13,
      lineNumbers: "on",
      roundedSelection: true,
      readOnly: props.readOnly || false,
      scrollbar: {
        vertical: "visible",
        horizontal: "visible",
      },
      padding: { top: 10 },
    });

    contentListener = editor.value.onDidChangeModelContent(() => {
      if (isApplyingExternalValue) return;
      emit("update:modelValue", model.value?.getValue() || "");
    });

    // Focus after mount if not read-only
    if (!props.readOnly) nextTick(() => editor.value?.focus());

    // Monaco sometimes mounts while the container is not yet measurable (dialogs, tabs, etc).
    // A ResizeObserver reliably triggers layout when the container gets a real size.
    resizeObserver = new ResizeObserver(() => editor.value?.layout());
    resizeObserver.observe(editorContainer.value);

    // Also force an initial layout after paint.
    requestAnimationFrame(() => editor.value?.layout());
  }
});

onBeforeUnmount(() => {
  if (resizeObserver && editorContainer.value) {
    resizeObserver.unobserve(editorContainer.value);
  }
  resizeObserver?.disconnect();
  resizeObserver = null;

  contentListener?.dispose();
  contentListener = null;

  editor.value?.dispose();
  editor.value = null;

  // Models are not disposed by editor.dispose() in all cases; dispose explicitly.
  model.value?.dispose();
  model.value = null;
});

watch(
  () => props.modelValue,
  (newValue) => {
    applyExternalValue(newValue || "");
  },
);

watch(
  () => props.language,
  (newLang) => {
    if (model.value)
      monaco.editor.setModelLanguage(model.value, newLang || "html");
  },
);

watch(
  () => props.theme,
  (newTheme) => {
    monaco.editor.setTheme(newTheme || "vs-dark");
  },
);

watch(
  () => props.readOnly,
  (readOnly) => {
    editor.value?.updateOptions({ readOnly: readOnly || false });
  },
);
</script>

<template>
  <div class="relative w-full h-full">
    <div
      ref="editorContainer"
      data-monaco-editor
      class="w-full h-full min-h-[120px] border rounded-md overflow-hidden bg-[#1e1e1e]"
    />
  </div>
</template>

<style scoped>
/* Ensure Monaco editor container can receive keyboard events */
:deep(.monaco-editor),
:deep([data-monaco-editor]) {
  pointer-events: auto !important;
}

:deep(.monaco-editor textarea) {
  pointer-events: auto !important;
}
</style>
