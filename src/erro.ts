import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/**
 * Saves error data to the log_error table in the database.
 *
 * @param {any} dados - {id, vctoDias, nome, email, cnpj, cpf, razaosocial, telefone, telefone2}.
 * @return {Promise<any>} - A promise that resolves to the created log_error object or rejects with an error.
 */
export default async function ErroSave(dados: any): Promise<any> {
  try {
    const data: any = {
      ref: dados.id.toString(),
      log: `${dados.telefone}${!!dados.telefone2 && `, ${dados.telefone2}`}`,
      dia: dados.vctoDias > 0?  `vencimento em: ${dados.vctoDias} dia` : 'vencimento hoje',
      titulo: !!dados.cnpj ? dados.razaosocial: dados.nome,
      email: dados.email,
      doc: !!dados.cnpj ? dados.cnpj: dados.cpf,
    }
    return await prisma.log_error.create(data)
  } catch (error: any) {
    return error.data
  }
}