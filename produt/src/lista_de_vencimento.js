"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function ListaDeVencimento(dias) {
    const data = new Date(new Date().setDate(new Date().getDate() + dias)).toISOString().split('T')[0];
    return await prisma.fcweb.findMany({
        where: {
            vctoCD: `${data}T00:00:00.000Z`,
            estatos_pgto: 'Pago',
            s_alerta: 'ATIVADO',
            id_fcw_soluti: {
                not: ""
            },
            OR: [
                { andamento: "EMITIDO" },
                { andamento: "APROVADO" }
            ]
        },
        select: {
            id: true,
            tipocd: true,
            vctoCD: true,
            nome: true,
            cpf: true,
            razaosocial: true,
            cnpj: true,
            telefone: true,
            telefone2: true,
            email: true,
            id_fcw_soluti: true
        }
    })
        .then(data => {
        const result = data.map((item) => {
            const titulo = !!item.cnpj ? item.razaosocial : item.nome;
            const doc = item.cnpj ? item.cnpj : item.cpf;
            const nsg = `Prezado Cliente ${item.nome}\n\nEstamos entrando em contato para informar que o seu Certificado digital\nModelo: *${item.tipocd} - ${titulo} - ${doc}*\nExpira${dias === 0 ? ': *Hoje*' : dias === 1 ? ': *Amanhã*' : ` em: *${dias} dias*`}\nVencimento: *${new Date(item.vctoCD).toLocaleDateString()}*\nfc: ${item.id}\n\nNão deixe para a última hora, Entre em contato agora\npelo WhatsApp (16) 3325-4134 e renove o seu certificado.\nAtenciosamente Equipe Rede Brasil Rp`;
            const data = Object.assign(Object.assign({}, item), { vctoDias: dias, nsg });
            return data;
        });
        return result;
    })
        .catch(e => {
        console.error(e);
        return [];
    });
}
exports.default = ListaDeVencimento;
