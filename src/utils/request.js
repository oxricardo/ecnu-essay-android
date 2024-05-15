import axios from "axios";
import {apiURL} from "./api";
const instance=axios.create({
    baseURL:apiURL
})

export default {
    get:instance.get,
    post:instance.post
}
