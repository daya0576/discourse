import { setupRenderingTest } from "ember-qunit";
import { hbs } from "ember-cli-htmlbars";
import { discourseModule, query } from "../../helpers/qunit-helpers";
import componentTest from "../../helpers/component-test";

discourseModule(
  "Integration | Component | user-status-message",
  function (hooks) {
    setupRenderingTest(hooks);

    componentTest("it renders", {
      template: hbs`<UserStatusMessage @status={{this.status}} />`,

      beforeEach() {
        this.set("status", { emoji: "tooth", description: "off to dentist" });
      },

      async test(assert) {
        assert.ok(
          query("img.emoji[title='tooth']", "the status emoji is shown")
        );
      },
    });
  }
);
