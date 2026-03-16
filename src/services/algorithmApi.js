import api from './axios.js'

const algorithmApi = {
  getAll() {
    return api.get('/equipments')
  },

  getById(id) {
    return api.get(`/equipments/${id}`)
  },

  update(id, data) {
    return api.put(`/equipments/${id}`, data)
  },
}

export default algorithmApi
