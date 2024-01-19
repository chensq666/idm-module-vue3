import "virtual:svg-icons-register";
import { defineAsyncComponent } from "vue";

export const setUpSvgComponent = (app) => {
    app.component("svg-icon", defineAsyncComponent({
        loader: () => import("./SvgIcon.vue"),
        delay: 0 // 200ms
    }))
}