"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const security = __importStar(require("./security"));
class Steganography {
    /**
     * @param param File path or File bytes as Buffer
     */
    static getBufferFromParams(param) {
        if (typeof param === "string")
            return Buffer.from(fs_1.default.readFileSync(param));
        else
            return Buffer.from(param);
    }
    /**
     * @param firstBuffer File bytes as Buffer
     * @param message String to concat
     */
    static concatBuffer(firstBuffer, message) {
        return Buffer.concat([firstBuffer, Buffer.from(message)]);
    }
    /**
     * @param message Parsed hidden string
     * @param key Key to decrypt message
     */
    static decryptMessage(message, key) {
        if (!key || key.length < 1)
            return message.trim();
        else {
            return security.decrypt(message, key);
        }
    }
    /**
     * @param file File path or File bytes as Buffer
     * @param message Text message to hide
     * @param key Key to encrypt message
     */
    static write(file, message, key) {
        const fileBuffer = Steganography.getBufferFromParams(file);
        if (!key || key.length < 1) {
            return Steganography.concatBuffer(fileBuffer, message);
        }
        else {
            const cipher = security.encrypt(message, key);
            return Steganography.concatBuffer(fileBuffer, cipher);
        }
    }
    /**
     * @param file File path or File bytes as Buffer
     * @param fileType
     * @param key Key to decrypt message
     */
    static decode(file, fileType, key) {
        const fileBuffer = Steganography.getBufferFromParams(file);
        let data = [];
        switch (fileType) {
            case "jpeg":
            case "jpg": {
                for (let i = fileBuffer.length - 1; i >= 0; i--) {
                    if (fileBuffer[i] === 0xd9 && fileBuffer[i - 1] === 0xff) {
                        break;
                    }
                    data.push(fileBuffer[i]);
                }
                data.reverse();
                const sortedBuffer = Buffer.from(data);
                const str = sortedBuffer.toString("ascii");
                return Steganography.decryptMessage(str, key);
            }
            case "png": {
                for (let i = fileBuffer.length - 1; i >= 0; i--) {
                    if (fileBuffer[i] === 0x82 &&
                        fileBuffer[i - 1] === 0x60 &&
                        fileBuffer[i - 2] === 0x42 &&
                        fileBuffer[i - 3] === 0xae &&
                        fileBuffer[i - 4] === 0x44 &&
                        fileBuffer[i - 5] === 0x4e &&
                        fileBuffer[i - 6] === 0x45 &&
                        fileBuffer[i - 7] === 0x49 &&
                        fileBuffer[i - 8] === 0x00 &&
                        fileBuffer[i - 9] === 0x00 &&
                        fileBuffer[i - 10] === 0x00 &&
                        fileBuffer[i - 11] === 0x00) {
                        break;
                    }
                    data.push(fileBuffer[i]);
                }
                data.reverse();
                const sortedBuffer = Buffer.from(data);
                const str = sortedBuffer.toString("ascii");
                return Steganography.decryptMessage(str, key);
            }
            case "pdf": {
                const asciiString = fileBuffer.toString("ascii");
                const str = asciiString.substring(asciiString.indexOf("%%EOF") + 5);
                return Steganography.decryptMessage(str, key);
            }
            default:
                throw new Error("Unsupported file type!");
        }
    }
}
exports.default = Steganography;
//# sourceMappingURL=steganography.class.js.map