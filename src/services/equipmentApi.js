import api from './axios.js'

const equipmentApi = {
    getAll() {
        return api.get('/equipments')
    },

    getById(id) {
        return api.get(`/equipments/${id}`)
    },

    create(data) {
        return api.post('/equipments', data)
    },

    update(id, data) {
        return api.put(`/equipments/${id}`, data)
    },

    delete(id) {
        return api.delete(`/equipments/${id}`)
    },
}

export default equipmentApi
