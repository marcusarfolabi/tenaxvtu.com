import api from "../axios";

export interface AirtimePayload {
  network: 'MTN' | 'GLO' | 'AIRTEL' | '9MOBILE';
  amount: string | number;
  phone: string;
}

export const airtimeApi = {
  /**
   * Purchase airtime for a specific phone number
   */
  buy: (data: AirtimePayload) => api.post("/services/airtime/buy", data),
};