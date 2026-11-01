const buildComponentTemplate = (name: string) => {
  return `export const ${name} = () => {
  return <div></div>
}`;
};

export default buildComponentTemplate;
