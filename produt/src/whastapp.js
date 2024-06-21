"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendWhatsapp = exports.VerificarWhatsapp = void 0;
require("dotenv/config");
const axios_1 = __importDefault(require("axios"));
/**
 * Verifies the availability of a WhatsApp number.
 *
 * @param {string} tel - The phone number to verify.
 * @return {Promise<any>} - A promise that resolves to the response data from the API or rejects with an error.
 */
const VerificarWhatsapp = async (tel) => {
    try {
        const url = `https://api.inovstar.com/core/v2/api/wa-number-check/55${tel}`;
        const request = await (0, axios_1.default)({
            method: 'POST',
            url: url,
            headers: {
                "access-token": process.env.WHATSAPPTOKEN,
                "Content-Type": 'application/json'
            },
        });
        return request.data;
    }
    catch (error) {
        const erroData = Object.assign(Object.assign({}, error.data), { telefone: tel });
        console.log(erroData);
        return erroData;
    }
};
exports.VerificarWhatsapp = VerificarWhatsapp;
/**
 * Sends a WhatsApp message to the specified phone number.
 *
 * @param {string} tel - The phone number to send the message to.
 * @param {string} msg - The message to be sent.
 * @return {Promise<any>} - A promise that resolves to the response from the API or rejects with an error.
 */
const SendWhatsapp = async (tel, msg) => {
    try {
        const url = 'https://api.inovstar.com/core/v2/api/chats/send-text';
        const request = await (0, axios_1.default)({
            method: 'POST',
            url: url,
            headers: {
                "access-token": process.env.WHATSAPPTOKEN,
                "Content-Type": 'application/json'
            },
            data: {
                number: '55' + tel,
                message: msg,
                forceSend: true,
                verifyContact: false,
            },
        });
        return request.data;
    }
    catch (error) {
        console.log(error.response.data);
        return error.response.data;
    }
};
exports.SendWhatsapp = SendWhatsapp;
