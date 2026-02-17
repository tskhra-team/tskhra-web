export const scrollToElement = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export const scrollToTop = () => {
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};
