import { visit } from "unist-util-visit";

const CALLOUT_PATTERN = /^\s*\[!(note|tip|info|warning|danger|caution)\]\s*/i;

function normalizeClassName(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(/\s+/).filter(Boolean);
  }

  return [];
}

export default function remarkCallouts() {
  return (tree) => {
    visit(tree, "blockquote", (node) => {
      const firstParagraph = node.children?.[0];

      if (!firstParagraph || firstParagraph.type !== "paragraph") {
        return;
      }

      const firstChild = firstParagraph.children?.[0];

      if (!firstChild || firstChild.type !== "text") {
        return;
      }

      const match = firstChild.value.match(CALLOUT_PATTERN);

      if (!match) {
        return;
      }

      const tone = match[1].toLowerCase();
      firstChild.value = firstChild.value.slice(match[0].length);

      if (!firstChild.value.length) {
        firstParagraph.children.shift();
      }

      if (!firstParagraph.children.length) {
        node.children.shift();
      }

      const data = node.data ?? (node.data = {});
      const hProperties = data.hProperties ?? (data.hProperties = {});
      const classes = new Set(normalizeClassName(hProperties.className));

      classes.add("md-callout");
      classes.add(`md-callout-${tone}`);

      hProperties.className = Array.from(classes);
      hProperties["data-callout"] = tone;
    });
  };
}
