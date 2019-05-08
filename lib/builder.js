const fs = require("fs");
const path = require("path");

class Builder {
    /**
     * @param {string} templateConfigPath
     */
    build(templateConfigPath) {
        console.log(`Processing template config '${templateConfigPath}'...`);
        var templateConfig = this.getTemplateConfig(templateConfigPath);
        console.log(`Processing template configuration...`);
        var i = 1;
        templateConfig.forEach(tc => {
            console.log(`Processing template config iteration #${i}`, tc);
            this.processTemplateConfig(tc);
            i++;
        });
    }

    /**
     * @param {import("./template-config").TemplateConfig} tc
     */
    processTemplateConfig(tc, indentLevel = 1) {
        const indentation = (indentLevel => new Array(indentLevel).fill("....").join(""))(indentLevel);
        const log = (...msgs) => msgs.forEach(x => console.log(`${indentation}${x}`));
        tc.sourceTemplatePath = path.normalize(tc.sourceTemplatePath);
        log(`${indentLevel}.1. Normalized source tempalte path: ${tc.sourceTemplatePath}`);
        tc.destinationPath = path.normalize(tc.destinationPath);
        log(`${indentLevel}.2. Normalized destination path: ${tc.destinationPath}`);
        var sourceTemplateName = path.basename(tc.sourceTemplatePath);
        log(`${indentLevel}.3. Source template name: '${sourceTemplateName}'`);
        var destinationFolderPath = path.join(tc.destinationPath, this.replaceTokens(sourceTemplateName, tc.tokens));
        log(`${indentLevel}.4. Checking destination folder path '${destinationFolderPath}'...`);
        if (!fs.existsSync(destinationFolderPath)) {
            log(`${indentLevel}.5. Creating folder '${destinationFolderPath}'`)
            fs.mkdirSync(destinationFolderPath);
        }
        else {
            log(`${indentLevel}.5. Folder ${destinationFolderPath} already exists`);
        }
        log(`${indentLevel}.6. Reading directory contents`);
        fs.readdirSync(tc.sourceTemplatePath).forEach(templateDir => {
            var templateDirPath = path.join(tc.sourceTemplatePath, templateDir);
            log(`${indentLevel}.7. Checking if the path '${templateDirPath}' is a directory or a file`);
            if(fs.lstatSync(templateDirPath).isDirectory()) {
                log(`${indentLevel}.8. Path '${templateDirPath}' is a directory`);
                var newTc = {};
                newTc.sourceTemplatePath = path.join(tc.sourceTemplatePath, templateDir);
                newTc.destinationPath = destinationFolderPath;
                newTc.tokens = tc.tokens;
                log(`${indentLevel}.9. Processing the contents of directory`)
                this.processTemplateConfig(newTc, indentLevel++);
            }
            else {
                log(`${indentLevel}.8. Path '${templateDirPath}' is a file`)
                var templateFilePath = path.join(tc.sourceTemplatePath, templateDir);
                var destinationFilePath = path.join(destinationFolderPath, this.replaceTokens(templateDir, tc.tokens));
                log(`${indentLevel}.9. Formatting the contents of file ${templateFilePath}`);
                var templateFileContent = fs.readFileSync(templateFilePath).toString();
                var destinationFileContent = this.replaceTokens(templateFileContent, tc.tokens);
                log(`${indentLevel}.10. Creating file '${destinationFilePath}'`);
                fs.writeFileSync(destinationFilePath, destinationFileContent);
            }
        });
    }

    /**
     * @param {string} str
     * @param {Array<import("./template-config").TemplateConfigToken>} tokens
     * @returns {string} string
     */
    replaceTokens(str, tokens) {
        tokens.forEach(ti => {
            str = str.split(`[${ti.name}]`).join(`${ti.value}`);
        })
        return str;
    }

    /**
     * @param {string} templateConfigPath
     * @returns {Array<import("./template-config").TemplateConfig>} Array<TemplateConfig>
     */
    getTemplateConfig(templateConfigPath) {
        templateConfigPath = path.normalize(templateConfigPath);
        return require(templateConfigPath);
    }
}

module.exports = new Builder();