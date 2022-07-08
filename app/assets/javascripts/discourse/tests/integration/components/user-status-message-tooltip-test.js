import { setupRenderingTest } from "ember-qunit";
import { hbs } from "ember-cli-htmlbars";
import { discourseModule, exists, query } from "../../helpers/qunit-helpers";
import componentTest from "../../helpers/component-test";

discourseModule(
  "Integration | Component | user-status-message-tooltip",
  function (hooks) {
    setupRenderingTest(hooks);

    componentTest("it renders", {
      template: hbs`<UserStatusMessageTooltip @status={{this.status}} />`,

      beforeEach() {
        this.set("status", { emoji: "tooth", description: "off to dentist" });
      },

      async test(assert) {
        assert.ok(
          exists("img.emoji[title='tooth']"),
          "the status emoji is shown"
        );
        assert.equal(
          query("div.user-status-message-tooltip").textContent.trim(),
          "off to dentist",
          "the status description is shown"
        );
      },
    });
  }
);
