import axios from 'axios'
import Vue from 'vue'

class EventService {
    constructor() {
        this.service = axios.create()
    }

    async list() {
        return this.service.get(`${Vue.config.backendUrl}/events`)
    }

    async create(payload) {
        return this.service.request({
            method: 'POST',
            url: `${Vue.config.backendUrl}/events`,
            responseType: 'json',
            data: payload
        })
    }
}

export default EventService