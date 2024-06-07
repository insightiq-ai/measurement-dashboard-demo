const fs = require("fs");

const importer = ({
  extension = "jsx",
  folderPath,
  customImportStatement = "import $customComponentName from '$pathName';",
  outputFile = "index.js",
  customExportStatement = "export {$components};",
}) => {
  const data = [];
  const fileNames = [];
  const importStrings = [];
  const componentNames = [];

  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    if (file === outputFile) {
      return;
    }

    const componentName = file.replace(`.${extension}`, "").replace(/-/g, "_");

    let importStatement = "";

    if (fs.lstatSync(folderPath + "/" + file).isDirectory()) {
      const files = fs.readdirSync(folderPath + "/" + file);
      files.forEach((fileItem) => {
        if (fileItem.endsWith(extension)) {
          const componentName = fileItem.replace(`.${extension}`, "").replace(/-/g, "_");
          const filePathName = `./${file}/${componentName}.${extension}`;
          const importStatement = customImportStatement.replace("$customComponentName", componentName).replace("$pathName", filePathName);
          importStrings.push(importStatement);
          componentNames.push(componentName);
        }
      });
      // const filePathName = `./${file}/${file}.${extension}`;
      // importStatement = customImportStatement.replace("$customComponentName", componentName).replace("$pathName", filePathName);
    } else if (file.endsWith(extension)) {
      importStatement = customImportStatement.replace("$customComponentName", componentName).replace("$pathName", `./${file}`);
      importStrings.push(importStatement);
      componentNames.push(componentName);
    }
    // if (importStatement.length > 0) {
    //   data.push(importStatement);
    //   fileNames.push(componentName);
    // }
  });
  const importStatement = importStrings.join("\n");
  data.push(importStatement);
  // const exportStatement = `export { ${componentNames.join(", ")} };`;
  // data.push(exportStatement);
  // const exportStatement = exportStrings.join("\n");
  // data.push(exportStatement);
  const exportStatement = customExportStatement.replace("$components", componentNames.join(", "));
  data.push(exportStatement);
  fs.writeFileSync(folderPath + `/${outputFile}`, data.join("\n"));
};

// to import all .svg files to index.js of icons/ folder
importer({
  extension: "svg",
  folderPath: "./src/components/icons",
  customImportStatement: "import { ReactComponent as $customComponentName} from '$pathName';",
  outputFile: "Icons.jsx",
  customExportStatement: "export default {$components};",
});

// to import all pages to index.js of pages/ folder
importer({ folderPath: "./src/pages" });

// // to import all components to index.js of components/ folder
importer({ folderPath: "./src/components" });
importer({ folderPath: "./src/containers" });
// importer({ folderPath: "./src/" });
