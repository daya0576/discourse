import Component from "@ember/component";
import { action } from "@ember/object";
import { createPopper } from "@popperjs/core";

export default Component.extend({
  @action
  onHover() {
    const popperAnchor = document.querySelector(".user-status-message");
    const tooltip = document.querySelector(".user-status-message-tooltip");

    this._popper = createPopper(popperAnchor, tooltip, {
      placement: "bottom",
    });
  },
});
