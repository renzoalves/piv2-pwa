import { defineStore } from 'pinia';

export const useContractStore = defineStore('contractData',{
    state: () => ({
        data: {}
    }),
    actions: {

        setPlanValue(value, valueFull, description){
            this.data.plan = {
                value: value,
                valueFull: valueFull,
                description: description,
            };
        },

        setPayment(type, installments, value){
            this.data.payment = {
                type: type,
                installments: installments,
                value: value
            };
        },

        setClient(client){
            this.data.client = client;
        },
        
    }
});