<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="demo">
        {{ propData.title }}
        <!-- <a-button>45646</a-button> -->
        <svg-icon icon-class="star"></svg-icon>
    </div>
</template>

<script setup>
// import { Button as AButton } from 'ant-design-vue'
import { useInject2Component } from '../regComponent'
// expose must before useInject2Component
defineExpose({
    propDataWatchHandle() {
        convertAttrToStyleObject()
    },
    receiveBroadcastMessage(object) {
        console.log('组件收到消息', object)
    },
    setContextValue(object) {
        console.log('统一接口设置的值', object)
    },
    getContextValue(object) {}
})
/**
 * use method inject element to component
 * @param { defaultPropData } defaultPropData
 * @param { _mountedCb } _mountedCb
 * @returns { propData, moduleObject }
 */
const { propData, moduleObject } = useInject2Component({ title: '文本' })

const initData = () => {
    // console.log(123)
}

const convertAttrToStyleObject = () => {
    const styleObject = {}
    IDM.style.setBackgroundStyle(styleObject, propData)
    for (const key in propData) {
        const element = propData[key]
        if (!element && element !== false && element != 0) {
            continue
        }
        switch (key) {
            case 'width':
            case 'height':
                styleObject[key] = element
                break
            case 'font':
                IDM.style.setFontStyle(styleObject, element)
                break
            case 'box':
                IDM.style.setBoxStyle(styleObject, element)
                break
            case 'border':
                IDM.style.setBorderStyle(styleObject, element)
                break
        }
    }
    IDM.setStyleToPageHead(moduleObject.id, styleObject)
    initData()
}
convertAttrToStyleObject()
</script>

<style scoped>
.demo {
    text-align: center;
}
</style>
