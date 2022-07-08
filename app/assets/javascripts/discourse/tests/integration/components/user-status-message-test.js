import componentTest, {
  setupRenderingTest,
} from "discourse/tests/helpers/component-test";
import { hbs } from "ember-cli-htmlbars";
import { discourseModule, exists } from "../../helpers/qunit-helpers";

discourseModule(
  "Integration | Component | user-status-message",
  function (hooks) {
    setupRenderingTest(hooks);

    componentTest("it renders user status emoji", {
      template: hbs`<UserStatusMessage @status={{this.status}} />`,

      beforeEach() {
        this.set("status", { emoji: "tooth", description: "off to dentist" });
      },

      async test(assert) {
        assert.ok(
          exists("img.emoji[title='tooth']"),
          "the status emoji is shown"
        );
      },
    });
  }
);
