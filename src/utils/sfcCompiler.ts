import {
  ref,
  reactive,
  computed,
  watch,
  watchEffect,
  onMounted,
  onUnmounted,
  onBeforeMount,
  onBeforeUnmount,
  nextTick,
  compile,
  defineComponent,
  defineProps,
} from "vue";
import * as VueNamespace from "vue";
import { Position, Handle } from "@vue-flow/core";

/**
 * Extracts a block (<template>, <script>, etc.) from SFC code.
 */
function extractBlock(code: string, tag: "template" | "script") {
  if (tag === "template") {
    const m = code.match(/<template[^>]*>([\s\S]*?)<\/template>/i);
    return m?.[1]?.trim() ?? "";
  }
  // <script> or <script setup>
  const m = code.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  return m?.[1]?.trim() ?? "";
}

/**
 * Evaluates the script block and returns component options.
 */
function evalScriptToOptions(
  scriptContent: string,
  injectedData: unknown,
  getNodeData: (id: string) => Record<string, unknown> | undefined,
) {
  const raw = scriptContent.trim();
  if (!raw) return {};

  // Remove ESM imports (not supported in simple eval)
  const body = raw.replace(/^\s*import\s+[\s\S]*?;?\s*$/gm, "");

  // Convert `export default` -> `return`
  let finalBody = body;
  if (finalBody.includes("export default")) {
    finalBody = finalBody.replace(/export\s+default/, "return");
  } else if (finalBody.startsWith("{") && finalBody.endsWith("}")) {
    finalBody = `return (${finalBody});`;
  } else {
    finalBody = `return { setup() { ${finalBody} } };`;
  }

  // Security: Only evaluate trusted SFC code
  // In production, this should be restricted to code from trusted sources
  // or validated through a whitelist/allowlist mechanism
  const isTrusted = true; // TODO: Implement trust validation (e.g., check provenance, signature, or user permission)

  if (!isTrusted) {
    throw new Error("SFC code evaluation is restricted to trusted sources");
  }

  try {
    const args = [
      "ref",
      "reactive",
      "computed",
      "watch",
      "watchEffect",
      "onMounted",
      "onUnmounted",
      "onBeforeMount",
      "onBeforeUnmount",
      "defineComponent",
      "nextTick",
      "data",
      "getNodeData",
      "Position",
      "Vue",
      "defineProps",
      finalBody,
    ];
    const fn = new Function(...args);

    return fn(
      ref,
      reactive,
      computed,
      watch,
      watchEffect,
      onMounted,
      onUnmounted,
      onBeforeMount,
      onBeforeUnmount,
      defineComponent,
      nextTick,
      injectedData,
      getNodeData,
      Position,
      VueNamespace,
      defineProps,
    );
  } catch (e) {
    console.error("Eval error:", e);
    throw e;
  }
}

/**
 * Compiles a full SFC string into a Vue component.
 */
export function compileSfc(
  sfcCode: string,
  nodeData: Record<string, unknown>,
  getNodeData: (id: string) => Record<string, unknown> | undefined,
) {
  let template = extractBlock(sfcCode, "template");
  const script = extractBlock(sfcCode, "script");

  // Fallback if no tags are used
  if (!template && !script && !sfcCode.includes("<script")) {
    template = sfcCode;
  } else if (!template) {
    throw new Error("Missing <template> block.");
  }

  const render = compile(template);
  const options = script
    ? evalScriptToOptions(script, nodeData, getNodeData)
    : {};

  return defineComponent({
    ...(options || {}),
    components: { Handle },
    data() {
      const userBox = typeof options.data === "function" ? options.data() : {};
      return { ...userBox, data: nodeData, getNodeData, Position };
    },
    render,
  });
}
