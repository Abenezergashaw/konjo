import axios from "axios";
import { useUrl } from "@/stores/url";

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");

const formatted = `${yyyy}-${mm}-${dd}`;

export function useAdminBalance() {
  const url = useUrl();

  async function get_cashflow(phone, from = formatted, to = formatted) {
    const res = await axios.get(`${url.url}/api/general/cashflow`, {
      params: {
        from,
        to,
        phonee: phone,
      },
    });

    console.log(phone);

    return res.data;
  }

  return { get_cashflow };
}
