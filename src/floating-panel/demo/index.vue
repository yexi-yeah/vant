<template>
  <demo-section>
    <van-tabs>
      <van-tab :title="t('basicUsage')">
        <van-floating-panel
          :lock-scroll="false"
          :safe-area-inset-bottom="true"
          :anchors="[100, 200, 400]"
        >
          <van-cell-group>
            <van-cell
              v-for="i in 26"
              :key="i"
              :title="String.fromCharCode(i + 64)"
              size="large"
            />
          </van-cell-group>
        </van-floating-panel>
      </van-tab>

      <van-tab :title="t('customAnchors')">
        <van-floating-panel v-model="height" :anchors="anchors">
          <div style="padding: 15px; text-align: center">
            <p>{{ t('panelShowHeight') }} {{ height.toFixed(0) }} px</p>
          </div>
        </van-floating-panel>
      </van-tab>

      <van-tab :title="t('headDragOnly')">
        <van-floating-panel :content-draggable="false">
          <div style="padding: 15px; text-align: center">
            <p>{{ t('contentUnDrag') }}</p>
          </div>
        </van-floating-panel>
      </van-tab>
    </van-tabs>
  </demo-section>
</template>

<script>
const windowHeight = window.innerHeight;
export default {
  i18n: {
    'zh-CN': {
      customAnchors: '自定义锚点',
      headDragOnly: '仅头部拖拽',
      panelShowHeight: '面板显示高度',
      contentUnDrag: '内容不可拖拽',
    },
    'en-US': {
      customAnchors: 'Custom Anchors',
      headDragOnly: 'Head Drag Only',
      panelShowHeight: 'Panel Show Height',
      contentUnDrag: 'Content cannot be dragged',
    },
  },
  data() {
    return {
      height: 100,
      anchors: [
        100,
        Math.round(0.4 * windowHeight),
        Math.round(0.7 * windowHeight),
      ],
    };
  },
};
</script>

<style lang="less">
.demo-cell {
  .custom-title {
    margin-right: 4px;
    vertical-align: middle;
  }

  .search-icon {
    font-size: 16px;
    line-height: inherit;
  }
}
</style>
