<template>
  <div
    idm-ctrl="idm_module"
    :id="moduleObject.id"
    :idm-ctrl-id="moduleObject.id"
  >
    <div class="isign">
      <div ref="fontNode">{{propData.title}}</div>
      <a-button class="test" type="primary">按钮</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button as AButton } from 'ant-design-vue'
import { useInject2Component } from '../regComponent.jsx'
import { onMounted, ref, reactive } from "vue";
const fontNode = ref<HTMLDivElement | null>(null)
defineExpose({
  propDataWatchHandle() {
    handleStyle()
  }
})
let mockData = {
  title: '文本内容',
  ulbox: {
    marginTopVal: "",
    marginRightVal: "",
    marginBottomVal: "",
    marginLeftVal: "",
    paddingTopVal: "1%",
    paddingRightVal: "2%",
    paddingBottomVal: "1%",
    paddingLeftVal: "2%"
  }
}
const { propData, moduleObject } = useInject2Component(mockData)

const handleStyle = () => {
  let styleObject = {};
  for(const key in propData) {
    if (propData.hasOwnProperty.call(propData, key)) {
      const element = propData[key]
      if (!element && element !== false && element != 0) {
        continue
      }
      switch(key) {
        case 'ulbox':
          window.IDM.style.setBoxStyle(styleObject, element)
          break
      }
    } 
  }
  window.IDM.setStyleToPageHead(moduleObject.id, styleObject)
}
const init = () => {
  console.log(fontNode.value)
  console.log(propData, moduleObject, '数据')
  handleStyle()
}
onMounted(() => {
  init()
})
</script>

<style lang="less" scoped>
.isign{
  box-sizing: border-box;
  .test{
    width: 100px
  }
}
</style>
