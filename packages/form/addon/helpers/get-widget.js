import Helper from "@ember/component/helper";
import { warn } from "@ember/debug";
import { inject as service } from "@ember/service";
import { ensureSafeComponent } from "@embroider/util";

import InputComponent from "@projectcaluma/ember-form/components/cf-field/input";
import FormComponent from "@projectcaluma/ember-form/components/cf-form";

const DEFAULT_WIDGETS = {
  "cf-field/input": InputComponent,
  "cf-form": FormComponent,
};

/**
 * Helper for getting the right widget.
 *
 * This helper expects n objects as positional parameters. It checks if the
 * object has a widget override in it's metadata. If one exists it checks if
 * said widget was registered in the caluma options service and then returns
 * the widget name. If it doesn't have a valid widget, the next object will be
 * checked. If no object returns a valid widget, the passed default widget will
 * be used.
 *
 * ```hbs
 * {{component (get-widget field.question someobject default="cf-form") foo=bar}}
 * ```
 *
 * @function getWidget
 * @param {Array} params
 * @param {Object} [options]
 * @param {String} [options.default]
 */
export default class GetWidgetHelper extends Helper {
  @service calumaOptions;

  compute(params, { default: defaultWidget = "cf-field/input" }) {
    for (const obj of params) {
      const widget = obj?.raw?.meta?.widgetOverride;
      if (!widget) {
        continue;
      }
      const override =
        widget &&
        this.calumaOptions
          .getComponentOverrides()
          .find(({ component }) => component === widget);

      warn(
        `Widget override "${widget}" is not registered. Please register it by calling \`calumaOptions.registerComponentOverride\``,
        override,
        { id: "ember-caluma.unregistered-override" },
      );

      if (override) {
        return ensureSafeComponent(
          override.componentClass ?? override.component,
          this,
        );
      }
    }

    return ensureSafeComponent(DEFAULT_WIDGETS[defaultWidget], this);
  }
}
