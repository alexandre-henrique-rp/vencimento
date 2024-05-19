import { SendEmail } from "./src/email";
import ErroSave from "./src/erro";
import ListaDeVencimento from "./src/lista_de_vencimento"
import { SendWhatsapp, VerificarWhatsapp } from "./src/whastapp";


function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function Manin() {
  const Dias = [30, 25, 20, 15, 10, 5, 1, 0];
  const lista = await Promise.all(Dias.map(async (dias) => {
    const data = await ListaDeVencimento(dias);
    return data;
  }));

  const listaFinal = lista.flat();
  const envio = []
  const erro = []

  await Promise.all(listaFinal.map(async (item) => {
    if (!!item.telefone2) {
      const send2 = await VerificarWhatsapp(item.telefone2);

      if (send2.status !== "INVALID_WA_NUMBER") {
        envio.push({ telefone: item.telefone2, nsg: item.nsg })
      }
    }
    const send = await VerificarWhatsapp(item.telefone);
    if (send.status !== "INVALID_WA_NUMBER") {
      envio.push({ telefone: item.telefone, nsg: item.nsg })
    } else {
      erro.push(item)
    }
  }));

  if(erro.length > 0) {
    await SendEmail(erro)
  }

  await Promise.all(erro.map(async (item) => {
    await ErroSave(item)
  }))

  await Promise.all(envio.map(async (item) => {
    const randomDelay = Math.floor(Math.random() * 25000) + 1000;
    await delay(randomDelay);
    await SendWhatsapp(item.telefone, item.nsg);
  }));
}


Manin();
