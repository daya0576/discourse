import Component from "@ember/component";
import { computed } from "@ember/object";
import I18n from "I18n";

export default class extends Component {
  tagName = "";

  @computed("status.ends_at")
  get until() {
    if (!this.status.ends_at) {
      return null;
    }

    const endsAt = moment.tz(this.status.ends_at, this.currentUser.timezone);
    const now = moment.tz(this.currentUser.timezone);
    const until = I18n.t("user_status.until");
    const localeData = moment.localeData(this.currentUser.locale);

    if (now.date() === endsAt.date()) {
      return `${until} ${endsAt.format(localeData.longDateFormat("LT"))}`;
    } else {
      return `${until} ${endsAt.format("MMM D")}`;
    }
  }
}
