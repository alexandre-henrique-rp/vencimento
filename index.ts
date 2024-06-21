import { SendEmail } from "./src/email";
import ErroSave from "./src/erro";
import ListaDeVencimento from "./src/lista_de_vencimento"
import { SendWhatsapp, VerificarWhatsapp } from "./src/whastapp";


function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function Manin() {
  const TI: any = ['16996029107', '16994134260'];
  
  await TI.map(async (item: any) => {
    return await SendWhatsapp(item, "inicio de envio alerta de vencimento");
  })

  const Dias = [60, 30, 20, 10, 1, 0];
  const lista = await Promise.all(Dias.map(async (dias) => {
    const data = await ListaDeVencimento(dias);
    return data;
  }));

  const listaFinal = lista.flat();
  const envio = []
  const erro = []

  await Promise.all(listaFinal.map(async (item) => {
    if (!!item.telefone2) {
      const send2 = await VerificarWhatsapp(item.telefone2.replace(/\D/g, ''));

      if (send2.status !== "INVALID_WA_NUMBER") {
        envio.push({ telefone: item.telefone2.replace(/\D/g, ''), nsg: item.nsg })
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
    await SendEmail(erro, envio.length);
    erro.map(async (item) => {
      await ErroSave(item);
    })
  }


  for (const item of envio) {
    const randomDelay = Math.floor(Math.random() * (25000 - 3000 + 1)) + 3000;
    await new Promise(resolve => setTimeout(resolve, randomDelay));
    await SendWhatsapp(item.telefone, item.nsg);
  }

  await TI.map(async (item: any) => {
    return await SendWhatsapp(item, "fim de envio alerta de vencimento");
  })
}


Manin();
