declare module "icon:react/*" {
  import type { SVGProps } from "react";
  import type React from "react";

  const component: (props: SVGProps<SVGSVGElement>) => React.ReactElement;
  export default component;
}
