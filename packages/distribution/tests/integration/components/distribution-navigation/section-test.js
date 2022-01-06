import Service from "@ember/service";
import { render } from "@ember/test-helpers";
import inquiry from "dummy/tests/helpers/inquiry";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module(
  "Integration | Component | distribution-navigation/section",
  function (hooks) {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    test("it renders", async function (assert) {
      this.type = "controlling";
      this.isActive = false;
      this.inquiries = [
        inquiry({
          addressedGroups: ["addressed3"],
          controllingGroups: ["controlling3"],
        }),
        inquiry({
          addressedGroups: ["addressed1"],
          controllingGroups: ["controlling1"],
        }),
        inquiry({
          addressedGroups: ["addressed2"],
          controllingGroups: ["controlling2"],
        }),
      ];

      this.owner.register(
        "service:router",
        class extends Service {
          isActive() {
            return this.isActive;
          }
        }
      );

      await render(
        hbs`<DistributionNavigation::Section @inquiries={{this.inquiries}} @type={{this.type}} />`
      );

      assert
        .dom("li:first-of-type > a")
        .hasText("t:caluma.distribution.types.controlling:()");
      assert.dom("ul > li:nth-of-type(1) > a").containsText("addressed1");
      assert.dom("ul > li:nth-of-type(2) > a").containsText("addressed2");
      assert.dom("ul > li:nth-of-type(3) > a").containsText("addressed3");
      assert.dom("button").exists({ count: 3 });

      this.set("type", "more");

      assert
        .dom("li:first-of-type > a")
        .hasText("t:caluma.distribution.types.more:()");
      assert.dom("ul > li:nth-of-type(1) > a").containsText("addressed1");
      assert.dom("ul > li:nth-of-type(2) > a").containsText("addressed2");
      assert.dom("ul > li:nth-of-type(3) > a").containsText("addressed3");

      this.set("type", "addressed");

      assert
        .dom("li:first-of-type > a")
        .hasText("t:caluma.distribution.types.addressed:()");
      assert.dom("ul > li:nth-of-type(1) > a").containsText("controlling1");
      assert.dom("ul > li:nth-of-type(2) > a").containsText("controlling2");
      assert.dom("ul > li:nth-of-type(3) > a").containsText("controlling3");
    });
  }
);