import { composeVisitors } from "lightningcss";

/**
 * Fallback for @scope
 *
 * @scope is not supported in some browsers.
 * mistcss prerequisite.
 *
 * Nested with specific data attributes.
 */
export const lightningcssVisitorScope = composeVisitors([
  {
    Rule: {
      scope(rule) {
        if (!rule.value.scopeStart) return undefined;

        return [
          // The original ASTs are intact.
          rule,
          {
            type: "style",
            value: {
              selectors: rule.value.scopeStart.map((selectors) => [
                {
                  type: "attribute",
                  name: "data-unsupport-scope",
                  operation: {
                    operator: "equal",
                    value: "true",
                  },
                },
                { type: "combinator", value: "descendant" },
                ...selectors,
              ]),
              loc: rule.value.loc,
              rules: rule.value.rules.map((rule_) => {
                if (rule_.type !== "style") return rule_;
                return {
                  ...rule_,
                  value: {
                    ...rule_.value,
                    selectors: rule_.value.selectors.map((selectors) => [
                      {
                        type: "nesting",
                      },
                      ...selectors.filter(
                        (selector) =>
                          selector.type !== "pseudo-class" ||
                          selector.kind !== "scope"
                      ),
                    ]),
                  },
                };
              }),
            },
          },
        ];
      },
    },
  },
]);
