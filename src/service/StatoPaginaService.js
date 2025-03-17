import { useRoute } from "vue-router";
export function isPortaleAgenziaAreaPage( route) {
    
    return route.path.startsWith('/venditore')

}