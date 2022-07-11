import { triggerEvent } from "@ember/test-helpers";
import componentTest, {
  setupRenderingTest,
} from "discourse/tests/helpers/component-test";
import { hbs } from "ember-cli-htmlbars";
import { discourseModule, query } from "discourse/tests/helpers/qunit-helpers";

async function mouseenter() {
  await triggerEvent(query("button"), "mouseenter");
}

discourseModule("Integration | Component | d-tooltip", function (hooks) {
  setupRenderingTest(hooks);

  componentTest("doesn't show tooltip if it wasn't expanded", {
    template: hbs`
      <button>
        <DTooltip>
          Tooltip text
        </DTooltip>
      </button>
    `,

    async test(assert) {
      assert.notOk(document.querySelector("[data-tippy-root]"));
    },
  });

  componentTest("it shows tooltip on mouseenter", {
    template: hbs`
      <button>
        <DTooltip>
          Tooltip text
        </DTooltip>
      </button>
    `,

    async test(assert) {
      await mouseenter();
      assert.ok(
        document.querySelector("[data-tippy-root]"),
        "the tooltip is added to the page"
      );
      assert.equal(
        document
          .querySelector("[data-tippy-root] .tippy-content")
          .textContent.trim(),
        "Tooltip text",
        "the tooltip content is correct"
      );
    },
  });
});
