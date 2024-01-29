// Utils
import { createNamespace, addUnit } from '../utils';

// Mixins
import { TouchMixin } from '../mixins/touch';

import { preventDefault } from '../utils/dom/event';

function closest(arr, target) {
  return arr.reduce((pre, cur) =>
    Math.abs(pre - target) < Math.abs(cur - target) ? pre : cur
  );
}

const [createComponent, bem] = createNamespace('floating-panel');
const DAMP = 0.2;
let startY = 0;

export default createComponent({
  mixins: [TouchMixin],
  props: {
    value: {
      type: [Number, String],
      default: 0,
    },
    anchors: {
      type: Array,
      default: () => [],
    },
    duration: {
      type: Number,
      default: 0.3,
    },
    lockScroll: {
      type: Boolean,
      default: true,
    },
    safeAreaInsetBottom: {
      type: Boolean,
      default: true,
    },
    contentDraggable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      rootRef: null,
      dragging: false,
      height: this.value,
      maxScroll: -1,
    };
  },
  mounted() {
    this.bindTouchEvent(this.$el);
  },
  computed: {
    boundary() {
      return {
        min: this.anchors[0] ?? 100,
        max:
          this.anchors[this.anchors.length - 1] ??
          Math.round(window.innerHeight * 0.6),
      };
    },
    _anchors() {
      return this.anchors.length >= 2
        ? this.anchors
        : [this.boundary.min, this.boundary.max];
    },

    rootStyle() {
      return {
        height: addUnit(this.boundary.max),
        transform: `translateY(calc(100% + -${addUnit(this.height)}))`,
        transition: !this.dragging
          ? `transform ${this.duration}s cubic-bezier(0.18, 0.89, 0.32, 1.28)`
          : 'none',
      };
    },
  },
  watch: {
    value(val) {
      this.height = val;
    },
    height(val) {
      this.$emit('input', val);
    },
    boundary: {
      handler() {
        console.log(123);
        // console.log('this._anchors==>>', this._anchors,this.height);
        this.height = closest(this._anchors || [], this.height);
      },
      immediate: true,
    },
  },
  methods: {
    onTouchStart(e) {
      this.touchStart(e);
      this.dragging = true;
      startY = -this.height;
      this.maxScroll = -1;
    },
    onTouchMove(e) {
      this.touchMove(e);
      const { target } = e;

      if (
        this.$refs.contentRef === target ||
        this.$refs.contentRef?.contains(target)
      ) {
        const { scrollTop } = this.$refs.contentRef;
        // If maxScroll value more than zero, indicates that panel movement is not triggered from the top
        this.maxScroll = Math.max(this.maxScroll, scrollTop);

        if (!this.contentDraggable) return;
        if (-startY < this.boundary.max) {
          preventDefault(e, true);
        } else if (!(scrollTop <= 0 && this.deltaY > 0) || this.maxScroll > 0) {
          return;
        }
      }

      const moveY = this.deltaY + startY;
      this.height = -this.ease(moveY);
    },
    onTouchEnd() {
      this.maxScroll = -1;
      this.dragging = false;
      this.height = closest(this._anchors, this.height);
      if (this.height !== -startY) {
        this.$emit('heightChange', { height: this.height });
      }
    },
    ease(moveY) {
      const absDistance = Math.abs(moveY);
      const { min, max } = this.boundary;

      if (absDistance > max) {
        return -(max + (absDistance - max) * DAMP);
      }

      if (absDistance < min) {
        return -(min - (min - absDistance) * DAMP);
      }

      return moveY;
    },
  },
  render() {
    return (
      <div
        class={[bem(), { 'van-safe-area-bottom': this.safeAreaInsetBottom }]}
        ref="rootRef"
        style={this.rootStyle}
        onTouchstartPassive={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}
        onTouchcancel={this.onTouchEnd}
      >
        <div class={bem('header')}>
          <div class={bem('header-bar')} />
        </div>
        <div class={bem('content')} ref="contentRef">
          {this.slots()}
        </div>
      </div>
    );
  },
});
