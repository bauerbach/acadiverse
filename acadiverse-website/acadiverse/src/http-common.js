import axios from "axios";
import Globals from '../../globals';

export default axios.create({
  baseURL: Globals.API_URL_AUTH,
  headers: {
    "Content-type": "application/json"
  }
});