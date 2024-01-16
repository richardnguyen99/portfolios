const parseLanguageId = (title: string) => {
  const extension = title.split(".").pop() ?? "";

  if (extension === "md") {
    return "markdown";
  }

  if (extension === "js") {
    return "javascript";
  }

  if (extension === "ts") {
    return "typescript";
  }

  if (extension === "tsx") {
    return "typescriptreact";
  }

  if (extension === "jsx") {
    return "javascriptreact";
  }

  if (extension === "css") {
    return "css";
  }

  if (extension === "scss") {
    return "scss";
  }

  if (extension === "html") {
    return "html";
  }

  if (extension === "json") {
    return "json";
  }

  if (extension === "c") {
    return "c";
  }

  return "plaintext";
};

export default parseLanguageId;
