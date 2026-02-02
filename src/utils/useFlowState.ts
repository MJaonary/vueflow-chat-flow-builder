import { ref } from "vue";
import { useStore } from "../stores/main";
import { useVueFlow } from "@vue-flow/core";
import type { Node, Edge } from "@vue-flow/core";

const storeKey = "vueFlowState";

export function useFlowState() {
  const store = useStore();
  // Use context-based useVueFlow to ensure we share state with the provider
  const { toObject, setNodes, setEdges, setViewport } = useVueFlow();

  const importedFile = ref<string | ArrayBuffer | null>(null);
  const importedFileName = ref("");
  const fileInput = ref<HTMLInputElement | null>(null);

  const onSave = () => {
    try {
      console.log("Saving flow data...");
      const flowData = toObject();
      console.log("Captured flow data:", flowData);

      store.$patch((state) => {
        if (state.layers) {
          state.layers.elements = flowData as unknown as Record<
            string,
            unknown
          >;
        }
      });

      const dataToStore = JSON.stringify(store.layers);
      console.log("Data to store length:", dataToStore.length);
      localStorage.setItem(storeKey, dataToStore);

      console.log("State saved successfully to localStorage");
      alert("State saved successfully.");
    } catch (error) {
      console.error("Error during onSave:", error);
      alert("Failed to save state. Check console for details.");
    }
  };

  const onRestore = (fromImport: boolean = false) => {
    let confirmation = true;

    if (!fromImport) {
      confirmation = confirm(
        "Restoring State.\nAll data not exported will be lost,\nDo you want to continue ?",
      );
    }

    if (confirmation) {
      const raw = localStorage.getItem(storeKey);
      if (!raw) {
        alert("No saved state found in localStorage.");
        return;
      }

      let parsed: Record<string, unknown> | null = null;
      try {
        parsed = JSON.parse(raw) as Record<string, unknown>;
      } catch {
        alert("Saved state is corrupted and cannot be parsed.");
        return;
      }

      if (!parsed || typeof parsed !== "object") {
        alert("Saved state is empty/invalid.");
        return;
      }

      store.$patch((state) => {
        const defaults = {
          messageToEdit: "",
          elements: {},
          messages: [],
          default_values: state.layers?.default_values ?? {
            image: "",
            video: "",
          },
          customNodes: [],
        };

        state.layers = {
          name:
            (parsed.name as string) ||
            state.layers?.name ||
            "Diagramme sans nom",
          ...defaults,
          ...parsed,
          default_values: {
            ...defaults.default_values,
            ...(parsed.default_values || {}),
          },
          customNodes: Array.isArray(parsed.customNodes)
            ? parsed.customNodes
            : [],
        };
      });

      const flow = store.layers?.elements;

      if (
        flow &&
        typeof flow === "object" &&
        "nodes" in flow &&
        "edges" in flow
      ) {
        const { viewport } = flow as {
          viewport?: { x: number; y: number; zoom: number };
        };
        const { x = 0, y = 0, zoom = 1 } = viewport || {};

        setNodes((flow.nodes as Node[]) || []);
        setEdges((flow.edges as Edge[]) || []);
        setViewport({ x: Number(x), y: Number(y), zoom: Number(zoom) });
      }
    }
  };

  const triggerImport = () => {
    fileInput.value?.click();
  };

  const fileSelected = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      importedFileName.value = target.value.replace(/.*[/\\]/, "");
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          importedFile.value = e.target.result;
          try {
            // Parse and validate JSON
            const parsed = JSON.parse(importedFile.value as string);
            
            // Lightweight shape validation
            if (
              typeof parsed !== "object" ||
              parsed === null ||
              !("layers" in parsed || "messages" in parsed || "elements" in parsed)
            ) {
              throw new Error("Invalid state structure");
            }

            if (
              confirm(
                `File loaded. Import content from ${importedFileName.value}?`,
              )
            ) {
              localStorage.setItem(storeKey, importedFile.value as string);
              onRestore(true);
            }
          } catch (error) {
            console.error("Failed to parse or validate imported file:", error);
            alert(
              `Failed to import file: ${error instanceof Error ? error.message : "Invalid file format"}. Please ensure the file is a valid JSON state file.`,
            );
          }
        }
      };
      reader.readAsText(target.files[0]);
    }
  };

  return {
    onSave,
    onRestore,
    triggerImport,
    fileSelected,
    fileInput,
    importedFile,
    importedFileName,
  };
}
