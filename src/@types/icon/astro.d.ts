declare module "icon:astro/*" {
  const component: (
    props: astroHTML.JSX.SVGAttributes
  ) => astroHTML.JSX.Element;
  export default component;
}
