import { defineStore } from 'pinia'

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    employee: {
      id: null,
      username: '',
      name:'',
      surname:'',
      urlFotoProfilo: '',
      email: '',
      token: '',
      authority:'',
      isAuthenticated: false
    }
  }),

  getters: {
    isLoggedIn: (state) => state.employee.isAuthenticated,
    getEmployeeData: (state) => state.employee
  },

  actions: {
    initializeStore() {
      // Recupera i dati dal localStorage all'avvio
      const savedState = localStorage.getItem('user-store')
      if (savedState) {
        this.$patch(JSON.parse(savedState))
      }
    },

    setEmployee(employeeData) {
      this.employee = {
        ...this.employee,
        ...employeeData,
        isAuthenticated: true
      }
      // Salva nel localStorage
      this.saveToLocalStorage()
    },

    clearEmployee() {
      this.employee = {
        id: null,
        name: '',
        email: '',
        isAuthenticated: false
      }
      // Rimuovi dal localStorage
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      localStorage.setItem('employee-store', JSON.stringify(this.$state))
    }
  }
})
