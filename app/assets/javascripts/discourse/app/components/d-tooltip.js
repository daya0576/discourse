import Component from "@ember/component";
import { createPopper } from "@popperjs/core";
import { tracked } from "@glimmer/tracking";
import { schedule } from "@ember/runloop";
import { action } from "@ember/object";

export default class DiscourseTooltip extends Component {
  tagName = "";
  @tracked tooltipIsShown = false;

  didInsertElement() {
    this._super(...arguments);
    this._initPopper();

    const popperAnchor = document.querySelector(".user-status-message");
    popperAnchor.addEventListener("mouseenter", this.showTooltip);
    popperAnchor.addEventListener("mouseleave", this.hideTooltip);
  }

  willDestroyElement() {
    const popperAnchor = document.querySelector(".user-status-message");
    popperAnchor.removeEventListener("mouseenter", this.showTooltip);
    popperAnchor.removeEventListener("mouseleave", this.hideTooltip);
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
      const tooltip = document.querySelector(".d-tooltip");
      this._popper = createPopper(popperAnchor, tooltip);
    });
  }
}
