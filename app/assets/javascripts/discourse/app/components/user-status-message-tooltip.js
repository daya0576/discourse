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

    return I18n.t("user_status.until");
  }
}
