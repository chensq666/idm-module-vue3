import { createApp, defineAsyncComponent, getCurrentInstance, inject, onMounted, reactive } from 'vue'
import { setUpSvgComponent } from './svgIcon/index'

const componentCodeSource = import.meta.glob('./idmComponents/*.vue')
const regComponents = ({ module, version }) => {
    module.forEach((item) => {
        const key = item.classId + '@' + version
        window[key] = function (moduleObject) {
            moduleObject.compositeAttr = item.compositeAttr
            if (item.innerAttr) moduleObject.innerAttr = item.innerAttr
            if (item.innerComName) moduleObject.innerComName = item.innerComName
            const CurrentComponent = defineAsyncComponent({
                loader: componentCodeSource['./idmComponents/' + item.className + '.vue'],
                delay: 0 // 200ms
            })
            const app = createApp({
                provide: {
                    rootPropData: reactive(moduleObject?.props?.compositeAttr || {}),
                    moduleObject: moduleObject,
                    injectMethods() {
                        const componentInstance = getCurrentInstance()
                        const { exposed = {} } = componentInstance
                        moduleObject.idmProps = function (props) {
                            for (const key in props.compositeAttr) {
                                componentInstance.provides.rootPropData[key] = props.compositeAttr[key]
                            }
                            exposed.propDataWatchHandle?.(props)
                        }
                        moduleObject.idmBroadcastMessage = function (object) {
                            exposed.receiveBroadcastMessage?.(object)
                        }
                        moduleObject.idmSetContextValue = function (object) {
                            exposed.setContextValue?.(object)
                        }
                        moduleObject.idmGetContextValue = function (object) {
                            exposed.getContextValue?.(object)
                        }
                        return componentInstance
                    },
                    onComponentMounted() {
                        moduleObject.mountComplete?.(moduleObject)
                    }
                },
                render: () => <CurrentComponent></CurrentComponent>
            })
            setUpSvgComponent(app)
            app.mount('#idm_' + moduleObject.id + (moduleObject.routerId ? moduleObject.routerId : ''))
            return app
        }
    })
}

const renderElement = ({ module, version }) => {
    setTimeout(function () {
        if (window.IDM && window.IDM.url.queryString('className')) {
            module.forEach((item) => {
                if (item.className == window.IDM.url.queryString('className')) {
                    window[item.classId + '@' + version].call(this, {
                        id: 'module_demo'
                    })
                }
            })
        }
    }, 100)
}

export const useSetupApp = (config) => {
    regComponents(config)
    renderElement(config)
}

export const useInject2Component = (defaultPropData = {}, _mountedCb = () => {}) => {
    const injectMethods = inject('injectMethods')
    const onComponentMounted = inject('onComponentMounted')
    const rootPropData = inject('rootPropData')
    const moduleObject = inject('moduleObject')
    injectMethods()
    onMounted(() => {
        onComponentMounted()
        _mountedCb()
    })
    return {
        propData: moduleObject.env ? rootPropData : reactive(defaultPropData),
        moduleObject
    }
}
