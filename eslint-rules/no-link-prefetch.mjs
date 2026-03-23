/**
 * ESLint rule: no-link-prefetch
 *
 * Workers Free Plan에서 자동 prefetch가 RSC 동시 요청 폭발→503/1102 유발.
 * 모든 <Link> 컴포넌트에 prefetch={false} 강제.
 *
 * @see docs/workers-503-prefetch-resolution.md
 */

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require prefetch={false} on Next.js <Link> components for Workers compatibility',
    },
    fixable: 'code',
    messages: {
      missingPrefetch:
        '<Link> must have prefetch={false} — Workers Free Plan에서 자동 prefetch가 503/1102 유발',
    },
    schema: [],
  },

  create(context) {
    return {
      JSXOpeningElement(node) {
        // Only target <Link> (not <a> or other elements)
        const name = node.name;
        if (name.type !== 'JSXIdentifier' || name.name !== 'Link') {
          return;
        }

        // Check if prefetch attribute exists with value {false}
        const prefetchAttr = node.attributes.find(
          (attr) => attr.type === 'JSXAttribute' && attr.name && attr.name.name === 'prefetch'
        );

        if (!prefetchAttr) {
          context.report({
            node,
            messageId: 'missingPrefetch',
            fix(fixer) {
              // Insert prefetch={false} before the closing > of the opening tag
              const lastAttr = node.attributes[node.attributes.length - 1];
              const insertAfter = lastAttr || node.name;
              return fixer.insertTextAfter(insertAfter, ' prefetch={false}');
            },
          });
          return;
        }

        // Check the value is explicitly {false}
        const value = prefetchAttr.value;
        if (value) {
          // JSXExpressionContainer with Literal false is OK
          if (
            value.type === 'JSXExpressionContainer' &&
            value.expression &&
            value.expression.type === 'Literal' &&
            value.expression.value === false
          ) {
            return; // prefetch={false} — correct
          }

          // Any other value (true, string, expression) is wrong
          context.report({
            node,
            messageId: 'missingPrefetch',
            fix(fixer) {
              return fixer.replaceText(prefetchAttr.value, '{false}');
            },
          });
        }
        // prefetch with no value means prefetch={true} in JSX — also wrong
        // But this case doesn't normally occur for prefetch
      },
    };
  },
};

export default rule;
