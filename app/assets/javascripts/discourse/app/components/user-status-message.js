import Component from "@ember/component";
import { action, computed } from "@ember/object";
import { createPopper } from "@popperjs/core";
import { schedule } from "@ember/runloop";
import { tracked } from "@glimmer/tracking";
import I18n from "I18n";

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

  @computed("status.ends_at")
  get until() {
    if (!this.status.ends_at) {
      return null;
    }

    const timezone = this.currentUser.timezone;
    const endsAt = moment.tz(this.status.ends_at, timezone);
    const now = moment.tz(timezone);
    const until = I18n.t("user_status.until");

    if (now.isSame(endsAt, "day")) {
      const localeData = moment.localeData(this.currentUser.locale);
      return `${until} ${endsAt.format(localeData.longDateFormat("LT"))}`;
    } else {
      return `${until} ${endsAt.format("MMM D")}`;
    }
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
