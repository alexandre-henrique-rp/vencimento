"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_1 = require("./src/email");
const erro_1 = __importDefault(require("./src/erro"));
const lista_de_vencimento_1 = __importDefault(require("./src/lista_de_vencimento"));
const whastapp_1 = require("./src/whastapp");
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function Manin() {
    const Dias = [30, 25, 20, 15, 10, 5, 1, 0];
    const lista = await Promise.all(Dias.map(async (dias) => {
        const data = await (0, lista_de_vencimento_1.default)(dias);
        return data;
    }));
    const listaFinal = lista.flat();
    const envio = [];
    const erro = [];
    await Promise.all(listaFinal.map(async (item) => {
        if (!!item.telefone2) {
            const send2 = await (0, whastapp_1.VerificarWhatsapp)(item.telefone2);
            if (send2.status !== "INVALID_WA_NUMBER") {
                envio.push({ telefone: item.telefone2, nsg: item.nsg });
            }
        }
        const send = await (0, whastapp_1.VerificarWhatsapp)(item.telefone);
        if (send.status !== "INVALID_WA_NUMBER") {
            envio.push({ telefone: item.telefone, nsg: item.nsg });
        }
        else {
            erro.push(item);
        }
    }));
    if (erro.length > 0) {
        await (0, email_1.SendEmail)(erro);
    }
    await Promise.all(erro.map(async (item) => {
        await (0, erro_1.default)(item);
    }));
    await Promise.all(envio.map(async (item) => {
        const randomDelay = Math.floor(Math.random() * 25000) + 1000;
        await delay(randomDelay);
        await (0, whastapp_1.SendWhatsapp)(item.telefone, item.nsg);
    }));
}
Manin();
