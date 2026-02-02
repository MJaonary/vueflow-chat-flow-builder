export interface NodeDefinition {
  type: string;
  editor: string;
  dragHandle?: string;
  draggable?: boolean;
  getDefaultData: (id: string, label?: string) => Record<string, unknown>;
}

export const nodeRegistry: Record<string, NodeDefinition> = {
  "message-container": {
    type: "message-container",
    editor: "MessageContainerEditor",
    dragHandle: ".node-drag-handle",
    getDefaultData: () => ({
      items: [],
      label: "Send Message",
    }),
  },
  "starting-step": {
    type: "starting-step",
    editor: "FallbackEditor",
    getDefaultData: (id) => ({
      id,
      type: "starting-step",
      label: "Label",
      content: "Type",
      color: "#ffffff",
      items: [],
    }),
  },
  image: {
    type: "image",
    editor: "ImageEditor",
    getDefaultData: (id) => ({
      id,
      type: "image",
      label: "Label",
      src: "https://images.unsplash.com/photo-1545703399-4313b14625d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8NHx8fGVufDB8fHx8&w=1000&q=80",
      width: "340px",
      height: "240px",
      color: "#000000",
    }),
  },
  tag: {
    type: "tag",
    editor: "TagEditor",
    getDefaultData: (id) => ({
      id,
      type: "tag",
      label: "Label",
      title: "Title",
      subtitle: "Subtitle",
      color: "#000000",
    }),
  },
  markdown: {
    type: "markdown",
    editor: "MarkdownEditor",
    getDefaultData: (id) => ({
      id,
      type: "markdown",
      content: "# Hello World\n\nUse the editor button to edit markdown...",
      color: "#ffffff",
    }),
  },
  "messenger-text": {
    type: "messenger-text",
    editor: "FallbackEditor",
    getDefaultData: (id) => ({
      id,
      type: "messenger-text",
      text: "Enter message text",
      buttons: [],
    }),
  },
  "messenger-image": {
    type: "messenger-image",
    editor: "FallbackEditor",
    getDefaultData: (id) => ({
      id,
      type: "messenger-image",
      image_url: "",
      link: "",
      buttons: [],
    }),
  },
  "messenger-card": {
    type: "messenger-card",
    editor: "FallbackEditor",
    getDefaultData: (id) => ({
      id,
      type: "messenger-card",
      image_url: "",
      title: "Title",
      subtitle: "Subtitle",
      buttons: [],
    }),
  },
  "messenger-audio": {
    type: "messenger-audio",
    editor: "FallbackEditor",
    getDefaultData: (id) => ({
      id,
      type: "messenger-audio",
      title: "",
      link: "",
    }),
  },
  "messenger-video": {
    type: "messenger-video",
    editor: "FallbackEditor",
    getDefaultData: (id) => ({
      id,
      type: "messenger-video",
      video_url: "",
      link: "",
      buttons: [],
    }),
  },
  "messenger-file": {
    type: "messenger-file",
    editor: "FallbackEditor",
    getDefaultData: (id) => ({
      id,
      type: "messenger-file",
      file_url: "",
      link: "",
    }),
  },
  "messenger-delay": {
    type: "messenger-delay",
    editor: "FallbackEditor",
    getDefaultData: (id) => ({
      id,
      type: "messenger-delay",
      delay_to_wait: "3",
    }),
  },
  "messenger-user-input": {
    type: "messenger-user-input",
    editor: "FallbackEditor",
    getDefaultData: (id) => ({
      id,
      type: "messenger-user-input",
      description: "User input expected",
    }),
  },
  "messenger-dynamic": {
    type: "messenger-dynamic",
    editor: "FallbackEditor",
    getDefaultData: (id) => ({
      id,
      type: "messenger-dynamic",
      description: "Dynamic content",
    }),
  },
};

export const getCustomNodeDefinition = (
  type: string,
  name: string,
  code: string,
  color?: string,
): NodeDefinition => ({
  type,
  editor: "CustomNodeInfo",
  getDefaultData: (id) => ({
    id,
    type,
    label: name,
    code,
    color: color || "#7e8c9e",
  }),
});
