#!/usr/bin/env node

try {
    const path = require("path");
    const builder = require("../lib/builder.js");
    console.log(process.cwd());
    var templateConfigFilePath = process.argv[2];
    if (!path.isAbsolute(templateConfigFilePath)) {
        templateConfigFilePath = path.join(process.cwd(), templateConfigFilePath);
    }
    console.log(`Tempalte config file: ${templateConfigFilePath}`);
    builder.build(templateConfigFilePath);
}
catch (ex) {
    console.log(`Error: `, ex);
}