import Component from "@ember/component";
import { action } from "@ember/object";
import { createPopper } from "@popperjs/core";
import { schedule } from "@ember/runloop";
import { tracked } from "@glimmer/tracking";

export default class extends Component {
  tagName = "";
  @tracked tooltipIsShown = false;

  didInsertElement() {
    this._super(...arguments);
    this._initPopper();
  }

  willDestroyElement() {
    this._popper.destroy();
  }

  @action
  showTooltip() {
    this.set("tooltipIsShown", true);
    schedule("afterRender", () => {
      this._popper.update();
    });
  }

  @action
  hideTooltip() {
    this.set("tooltipIsShown", false);
  }

  _initPopper() {
    schedule("afterRender", () => {
      const popperAnchor = document.querySelector(".user-status-message");
      const tooltip = document.querySelector(".user-status-message-tooltip");
      this._popper = createPopper(popperAnchor, tooltip);
    });
  }
}
