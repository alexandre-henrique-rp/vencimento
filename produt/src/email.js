"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendEmail = void 0;
require("dotenv/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
/**
 * Sends an email with the provided data.
 *
 * @param {any} dados - {id, vctoDias, nome, email, cnpj, cpf, razaosocial, telefone, telefone2}.
 * @return {Promise<any>} - A promise that resolves to the result of sending the email or rejects with an error.
 */
const SendEmail = async (dados, concluido) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'redebrasilrp@gmail.com',
                pass: process.env.EMAILTOKEN,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        const emailOptions = {
            from: 'redebrasilrp@gmail.com',
            to: 'redebrasilrp@gmail.com, kingdever88@gmail.com',
            subject: `Vencimento ${new Date().toLocaleDateString()}`,
            html: `
      <html>
        <body>
          <h1>Vencimento ${new Date().toLocaleDateString()}</h1>
          <br/>
          <br/>
          <table style="border: 1px solid black; border-collapse: collapse;">
            <tr style="border: 1px solid black; border-collapse: collapse; background-color: #7bf1a8">
              <th style="border: 1px solid black; border-collapse: collapse; text-align: center">titulo</th>
              <th style="border: 1px solid black; border-collapse: collapse; text-align: center">doc</th>
              <th style="border: 1px solid black; border-collapse: collapse; text-align: center">id</th>
              <th style="border: 1px solid black; border-collapse: collapse; text-align: center">Email</th>
              <th style="border: 1px solid black; border-collapse: collapse; text-align: center">Telefone</th>
              <th style="border: 1px solid black; border-collapse: collapse; text-align: center">Telefone2</th>
              <th style="border: 1px solid black; border-collapse: collapse; text-align: center">vencimento</th>
            </tr>
            ${dados.map((item) => `
              <tr>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 0px 5px">${item.cnpj ? item.razaosocial : item.nome}</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 0px 5px">${item.cnpj ? item.cnpj : item.cpf}</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 0px 5px">${item.id}</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 0px 5px">${item.email.toLowerCase()}</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 0px 5px">${item.telefone}</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 0px 5px">${item.telefone2.replace(/\D/g, '')}</td>
                <td style="border: 1px solid black; border-collapse: collapse; padding: 0px 5px">${item.vctoDias > 0 ? `vencimento em: ${item.vctoDias} dia - ${new Date(item.vctoCD).toLocaleDateString()}` : `vencimento hoje - ${new Date(item.vctoCD).toLocaleDateString()}`}</td>
              </tr>
            `).join('')}
          </table>
          <br/>
          <br/>
          <br/>
          <br/>
          <p>Total de contatos com mensagem enviada: ${concluido}</p>
          <p>Contatos com erro: ${dados.length}</p>
        </body>
      </html>
      `,
        };
        const emailResult = await transporter.sendMail(emailOptions);
        return emailResult;
    }
    catch (error) {
        console.error("Erro ao enviar email:", error);
        return error;
    }
};
exports.SendEmail = SendEmail;
