"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Saves error data to the log_error table in the database.
 *
 * @param {any} dados - {id, vctoDias, nome, email, cnpj, cpf, razaosocial, telefone, telefone2}.
 * @return {Promise<any>} - A promise that resolves to the created log_error object or rejects with an error.
 */
async function ErroSave(dados) {
    try {
        const Tel2 = dados.telefone2.replace(/\D/g, '') === '' ? '' : ` - ${dados.telefone2.replace(/\D/g, '')}`;
        const data = {
            data: {
                ref: dados.id.toString(),
                log: `${dados.telefone}${Tel2}`,
                dia: dados.vctoDias > 0
                    ? `vencimento em: ${dados.vctoDias} dia`
                    : "vencimento hoje",
                titulo: !!dados.cnpj ? dados.razaosocial : dados.nome,
                email: dados.email,
                doc: !!dados.cnpj ? dados.cnpj : dados.cpf,
                updatedAt: new Date().toISOString(),
            },
        };
        const result = await prisma.log_error.create(data);
        return result;
    }
    catch (error) {
        console.log(error);
        return error.data;
    }
}
exports.default = ErroSave;
