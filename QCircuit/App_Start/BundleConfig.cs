using System.Web;
using System.Web.Optimization;

namespace QCircuit
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bugfix").Include(
                        "~/Scripts/bugfix/bugfix.js",
                        "~/Scripts/bugfix/bugfix.flex.js"));

            bundles.Add(new ScriptBundle("~/bundles/mixins").Include(
                        "~/Scripts/mixins/mixins.js",
                        "~/Scripts/mixins/mixins.events.js"));

            bundles.Add(new ScriptBundle("~/bundles/interaction").Include(
                        "~/Scripts/interaction/interaction.js",
                        "~/Scripts/interaction/interaction.animation.js",
                        "~/Scripts/interaction/interaction.intersect.js",
                        "~/Scripts/interaction/interaction.touch.js",
                        "~/Scripts/interaction/interaction.drag.js",
                        "~/Scripts/interaction/interaction.scroll.js"));

            bundles.Add(new ScriptBundle("~/bundles/quantum").Include(
                        "~/Scripts/circuit/quantum.js",
                        "~/Scripts/circuit/quantum.workspace.js",
                        "~/Scripts/circuit/quantum.gate.js",
                        "~/Scripts/circuit/quantum.gatefactory.js",
                        "~/Scripts/circuit/quantum.factoryshowroom.js",
                        "~/Scripts/circuit/quantum.slot.js",
                        "~/Scripts/circuit/quantum.circuit.js",
                        "~/Scripts/circuit/quantum.circuitbuilder.js"));

            bundles.Add(new StyleBundle("~/Content/bugfix").Include(
                        "~/Content/bugfix/bugfix.css"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                        "~/Content/main.css",
                        "~/Content/validation.css"));

            bundles.Add(new StyleBundle("~/Content/quantum").Include(
                        "~/Content/circuit/quantum.css"));
        }
    }
}
