const { mongoWrapper } = require("../dependency.js").dal();

/**
 * @param {import("../model/@types/[domain].bo")} [domain]
 */
module.exports.[dbop] = async function [dbop]([domain]) {
    return (await mongoWrapper.connect("mongodb://localhost:27017", "[dbname]"))
    .[dbop]("[domainp]", [domain]);
}