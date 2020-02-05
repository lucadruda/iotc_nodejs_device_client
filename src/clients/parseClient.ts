import CommonInterface from "../models/commonInterface";
import { CapabilityModel, InterfaceMap } from "../types/capabilities";

export function parse(capabilityModel: CapabilityModel, propertyCallback, commandCallback): InterfaceMap {
    let res = {};
    if (capabilityModel && capabilityModel.implements && capabilityModel.implements.length > 0) {
        capabilityModel.implements.forEach(interf => {
            if (interf["@type"] === 'InterfaceInstance') {
                if (interf.name && interf.name.length > 0) {
                    const interfaceName = interf.name;
                    let cInf = new CommonInterface(interfaceName, interf["@id"], propertyCallback, commandCallback);
                    if (interf.schema.contents && interf.schema.contents.length > 0) {
                        const items = interf.schema.contents;
                        items.forEach(item => {
                            if (item["@type"] && item["@type"] === 'Property') {
                                cInf.addProperty(item.name,item.writable);
                            }
                            else if (item["@type"] && item["@type"] === 'Command') {
                                cInf.addCommand(item.name);
                            }
                            else if (item["@type"] && item["@type"] === 'Telemetry') {
                                cInf.addTelemetry(item.name);
                            }
                        });
                    }
                    res[interfaceName] = cInf;
                }
            }
        });
    }
    return res;
}