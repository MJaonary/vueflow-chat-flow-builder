import { onMounted, onUnmounted } from "vue";
import { useVueFlow } from "@vue-flow/core";

export function useKeyboardShortcuts() {
  const { setInteractive } = useVueFlow("main-flow");

  const onKeyUp = (event: KeyboardEvent): void => {
    switch (event.key) {
      case "AltGraph":
        setInteractive(true);
        break;

      default:
        break;
    }
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    switch (event.key) {
      case "AltGraph":
        setInteractive(false);
        break;

      default:
        break;
    }
  };

  onMounted(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
  });
}
