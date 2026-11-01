const buildComponentTemplate = (
  name: string,
  stylesheetExt: string,
  componentExt: string,
) => {
  return `import styles from "./${name}.module.${stylesheetExt}"
import { use${name} } from "./use${name}.${componentExt}"

export const ${name} = () => {
  const hook = use${name}();
  return <div className={styles.${name.toLowerCase()}></div>
}`;
};

export default buildComponentTemplate;
