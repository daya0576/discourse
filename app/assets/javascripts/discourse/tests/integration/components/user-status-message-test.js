import { triggerEvent } from "@ember/test-helpers";
import componentTest, {
  setupRenderingTest,
} from "discourse/tests/helpers/component-test";
import { hbs } from "ember-cli-htmlbars";
import {
  discourseModule,
  exists,
  fakeTime,
  query,
} from "discourse/tests/helpers/qunit-helpers";

async function mouseenter() {
  await triggerEvent(query(".user-status-message"), "mouseenter");
}

discourseModule(
  "Integration | Component | user-status-message",
  function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
      this.currentUser.timezone = "UTC";
    });

    hooks.afterEach(function () {
      if (this.clock) {
        this.clock.restore();
      }
    });

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

    componentTest("doesn't show tooltip if it wasn't expanded", {
      template: hbs`<UserStatusMessage @status={{this.status}} />`,

      beforeEach() {
        this.set("status", {
          emoji: "tooth",
          description: "off to dentist",
        });
      },

      async test(assert) {
        assert.ok(
          exists(".user-status-message-tooltip"),
          "the tooltip is added to the page"
        );
        assert.notOk(
          exists(".user-status-message-tooltip.is-expanded"),
          "but the tooltip isn't visible"
        );
      },
    });

    componentTest("it shows tooltip on mouseenter", {
      template: hbs`<UserStatusMessage @status={{this.status}} />`,

      beforeEach() {
        this.set("status", {
          emoji: "tooth",
          description: "off to dentist",
        });
      },

      async test(assert) {
        await mouseenter();

        assert.ok(
          exists(".user-status-message-tooltip.is-expanded"),
          "the tooltip is shown"
        );
        assert.ok(
          exists(
            "div.user-status-message-tooltip.is-expanded img.emoji[title='tooth']"
          ),
          "the status emoji is shown"
        );
        assert.ok(
          query("div.user-status-message-tooltip.is-expanded")
            .textContent.trim()
            .includes("off to dentist"),
          "the status description is shown"
        );
      },
    });

    componentTest(
      "it shows the until TIME on the tooltip if status will expire today",
      {
        template: hbs`<UserStatusMessage @status={{this.status}} />`,

        beforeEach() {
          this.clock = fakeTime(
            "2100-02-01T08:00:00.000Z",
            this.currentUser.timezone,
            true
          );
          this.set("status", {
            emoji: "tooth",
            description: "off to dentist",
            ends_at: "2100-02-01T12:30:00.000Z",
          });
        },

        async test(assert) {
          await mouseenter();
          assert.equal(
            query(".status-until").textContent.trim(),
            "Until: 12:30 PM"
          );
        },
      }
    );

    componentTest(
      "it shows the until DATE on the tooltip if status will expire tomorrow",
      {
        template: hbs`<UserStatusMessage @status={{this.status}} />`,

        beforeEach() {
          this.clock = fakeTime(
            "2100-02-01T08:00:00.000Z",
            this.currentUser.timezone,
            true
          );
          this.set("status", {
            emoji: "tooth",
            description: "off to dentist",
            ends_at: "2100-02-02T12:30:00.000Z",
          });
        },

        async test(assert) {
          await mouseenter();
          assert.equal(
            query(".status-until").textContent.trim(),
            "Until: Feb 2"
          );
        },
      }
    );

    componentTest(
      "it doesn't show until datetime on the tooltip if status doesn't have expiration date",
      {
        template: hbs`<UserStatusMessage @status={{this.status}} />`,

        beforeEach() {
          this.clock = fakeTime(
            "2100-02-01T08:00:00.000Z",
            this.currentUser.timezone,
            true
          );
          this.set("status", {
            emoji: "tooth",
            description: "off to dentist",
            ends_at: null,
          });
        },

        async test(assert) {
          await mouseenter();
          assert.notOk(exists(".status-until"));
        },
      }
    );
  }
);
