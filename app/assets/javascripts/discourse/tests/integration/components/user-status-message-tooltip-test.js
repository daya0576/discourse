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

discourseModule(
  "Integration | Component | user-status-message-tooltip",
  function (hooks) {
    setupRenderingTest(hooks);

    hooks.afterEach(function () {
      if (this.clock) {
        this.clock.restore();
      }
    });

    componentTest("it renders status emoji and description", {
      template: hbs`<UserStatusMessageTooltip @status={{this.status}} />`,

      beforeEach() {
        this.set("status", {
          emoji: "tooth",
          description: "off to dentist",
        });
      },

      async test(assert) {
        assert.ok(exists("img.emoji[title='tooth']"), "shows the status emoji");
        assert.ok(
          query("div.user-status-message-tooltip")
            .textContent.trim()
            .includes("off to dentist"),
          "show the status description"
        );
      },
    });

    componentTest("it shows until time if status will expire today", {
      template: hbs`<UserStatusMessageTooltip @status={{this.status}} />`,

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
        assert.equal(
          query(".status-until").textContent.trim(),
          "Until: 12:30pm"
        );
      },
    });

    componentTest("it shows 'Until tomorrow' if status will expire tomorrow", {
      template: hbs`<UserStatusMessageTooltip @status={{this.status}} />`,

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
        assert.equal(
          query(".status-until").textContent.trim(),
          "Until tomorrow"
        );
      },
    });

    componentTest(
      "it shows until date if status will expire the day after tomorrow",
      {
        template: hbs`<UserStatusMessageTooltip @status={{this.status}} />`,

        beforeEach() {
          this.clock = fakeTime(
            "2100-02-01T08:00:00.000Z",
            this.currentUser.timezone,
            true
          );
          this.set("status", {
            emoji: "tooth",
            description: "off to dentist",
            ends_at: "2100-02-03T12:30:00.000Z",
          });
        },

        async test(assert) {
          assert.equal(
            query(".status-until").textContent.trim(),
            "Until: Feb 3"
          );
        },
      }
    );

    componentTest(
      "it doesn't show until datetime if status doesn't have expiration date",
      {
        template: hbs`<UserStatusMessageTooltip @status={{this.status}} />`,

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
          assert.notOk(
            query(".status-until").textContent.trim().includes("Until")
          );
        },
      }
    );
  }
);
