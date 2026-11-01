const buildComponentTemplate = (name: string, stylesheetExt: string) => {
  return `import styles from "./${name}.module.${stylesheetExt}"

export const ${name} = () => {
  return <div className={styles.${name.toLowerCase()}></div>
}`;
};

export default buildComponentTemplate;
