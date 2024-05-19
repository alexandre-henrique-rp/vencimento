import 'dotenv/config'
import axios from "axios";

/**
 * Verifies the availability of a WhatsApp number.
 *
 * @param {string} tel - The phone number to verify.
 * @return {Promise<any>} - A promise that resolves to the response data from the API or rejects with an error.
 */
export const VerificarWhatsapp = async (tel: string): Promise<any> => {
  try {
    const url =`https://api.inovstar.com/core/v2/api/wa-number-check/55${tel}`;

    const request = await axios({
      method: 'POST',
      url: url,
      headers: {
        "access-token": process.env.WHATSAPPTOKEN,
        "Content-Type": 'application/json'
      },
    })
    
    return request.data
  } catch (error: any) {
    console.log(error.data)
    return error.data
  }
};


/**
 * Sends a WhatsApp message to the specified phone number.
 *
 * @param {string} tel - The phone number to send the message to.
 * @param {string} msg - The message to be sent.
 * @return {Promise<any>} - A promise that resolves to the response from the API or rejects with an error.
 */
export const SendWhatsapp = async (tel: string, msg: string): Promise<any> => {
  try {
    const url = 'https://api.inovstar.com/core/v2/api/chats/send-text';
    const request = await axios({
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
    })
    
    return request.data
  } catch (error: any) {
    console.log(error.response.data)
    return error.response.data
  }
};