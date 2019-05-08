const { dal, mapper } = require("../dependency.js").create();

/**
 * @param {import("../model/@types/[domain].dto").DTO.[domainp]} [domain]
 */
module.exports = async ([domain]) => {
    var [domain]BO = mapper.dto2bo([domain]);
    var result = await dal.[dbop]([domain]BO);
    return result;
};