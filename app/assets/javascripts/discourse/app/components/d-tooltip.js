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
      // Ember.ViewUtils.getViewBounds is a private API, but
      // it won't be broken without a public deprecation warning,
      // see: https://stackoverflow.com/a/50125938/3206146
      // eslint-disable-next-line no-undef
      const viewBounds = Ember.ViewUtils.getViewBounds(this);
      const element = viewBounds.firstNode;
      const parent = viewBounds.parentElement;
      this._popper = createPopper(parent, element);
    });
  }
}
