import { defineStore } from "pinia";

interface MessageItem {
  id: string;
  type?: string;
  text?: string;
  keyword?: string;
  buttons?: Array<{ id: string; text: string }>;
  // Card/Image/Video properties
  number?: string;
  image_url?: string;
  video_url?: string;
  link?: string;
  title?: string;
  subtitle?: string;
  default_action?: Array<{ id: string; text: string }>;
  // Audio properties
  // File properties
  file_url?: string;
  // Delay properties
  delay_to_wait?: string;
  // UserInput/Dynamic properties
  description?: string;
  [key: string]: unknown;
}

interface Message {
  id: string;
  type: string;
  editor?: string;
  label?: string;
  color?: string;
  items?: MessageItem[];
  content?: string;
  width?: string;
  height?: string;
  src?: string;
  title?: string;
  subtitle?: string;
  text?: string;
  [key: string]: unknown;
}

interface DefaultValues {
  image: string;
  video: string;
}

interface CustomNode {
  id: string;
  name: string;
  type: string;
  code: string;
  logoColor?: string;
}

interface LayersState {
  name: string;
  messageToEdit: string;
  elements: Record<string, unknown>;
  messages: Message[];
  default_values: DefaultValues;
  customNodes: CustomNode[];
}

interface MainState {
  layers: LayersState;
}

export const useStore = defineStore("main", {
  state: (): MainState => {
    return {
      layers: {
        name: "Untitled Flow",
        messageToEdit: "",
        elements: {
          nodes: [],
          edges: [],
          position: [0, 0],
          zoom: 1,
        },
        messages: [],
        default_values: {
          image:
            "https://images.unsplash.com/photo-1545703399-4313b14625d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8NHx8fGVufDB8fHx8&w=1000&q=80",
          video: "",
        },
        customNodes: [],
      },
    };
  },
  getters: {
    getMessages: (state): Message[] => state.layers.messages,
    getMessageById: (state) => {
      return (messageId: string): Message | undefined =>
        state.layers.messages.find((element) => element.id === messageId);
    },
    getItemById: (state) => {
      return (messageId: string, itemId: string): MessageItem | undefined => {
        const message = state.layers.messages.find(
          (element) => element.id == messageId,
        );
        // If the message itself is the item (standalone node)
        if (message && message.id == itemId) {
          return message as unknown as MessageItem;
        }
        return message?.items?.find((element) => element.id == itemId);
      };
    },
    getDefaultValues: (state): DefaultValues => state.layers.default_values,
    getCustomNodes: (state): CustomNode[] => state.layers.customNodes,
  },
  actions: {
    setMessageItems(messageId: string, items: MessageItem[]): void {
      const result = this.layers.messages.find(
        (element) => element.id === messageId,
      );
      if (result) {
        result.items = items;
      }
    },
    removeMessageItem(messageId: string, itemId: string): void {
      const message = this.layers.messages.find(
        (element) => element.id === messageId,
      );
      if (message) {
        if (message.id === itemId) {
          // Remove the entire message/node
          this.layers.messages = this.layers.messages.filter(
            (m) => m.id !== messageId,
          );
          // Also remove from vue-flow elements
          if (Array.isArray(this.layers.elements.nodes)) {
            this.layers.elements.nodes = this.layers.elements.nodes.filter(
              (n: { id: string }) => n.id !== messageId,
            );
          }
        } else if (message.items) {
          // Remove nested item
          message.items = message.items.filter((item) => item.id !== itemId);
        }
      }
    },
    updateItemProperty(
      messageId: string,
      itemId: string,
      property: string,
      value: unknown,
    ): void {
      const message = this.layers.messages.find(
        (element) => element.id === messageId,
      );
      if (message && message.items) {
        const item = message.items.find((element) => element.id === itemId);
        if (item) {
          item[property] = value;
        }
      }
    },
    addCustomNode(node: CustomNode): void {
      if (!this.layers) {
        this.layers = {
          name: "Untitled Flow",
          messageToEdit: "",
          elements: { nodes: [], edges: [], position: [0, 0], zoom: 1 },
          messages: [],
          default_values: { image: "", video: "" },
          customNodes: [],
        };
      }
      if (!Array.isArray(this.layers.customNodes)) {
        this.layers.customNodes = [];
      }
      this.layers.customNodes.push(node);
    },
    updateCustomNode(id: string, data: Partial<CustomNode>): void {
      const nodeIndex = this.layers.customNodes.findIndex(
        (node) => node.id === id,
      );
      if (nodeIndex !== -1) {
        // Ensure we don't accidentally set required fields to undefined if they are compliant in runtime
        this.layers.customNodes[nodeIndex] = {
          ...this.layers.customNodes[nodeIndex],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(data as any),
        };
      }
    },
  },
});
