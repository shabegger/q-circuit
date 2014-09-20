using System.Web;
using System.Web.Optimization;

namespace QCircuit
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
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

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                        "~/Scripts/bootstrap.js",
                        "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/svg").Include(
                        "~/Scripts/svg/svg.js",
                        "~/Scripts/svg/svg.draggable.min.js",
                        "~/Scripts/svg/svg.filter.min.js",
                        "~/Scripts/svg-custom/svg.custom.filter.js",
                        "~/Scripts/svg-custom/svg.custom.location.js"));

            bundles.Add(new ScriptBundle("~/bundles/quantum").Include(
                        "~/Scripts/mixins/mixins.js",
                        "~/Scripts/mixins/mixins.events.js",
                        "~/Scripts/mixins/mixins.layout.js",
                        "~/Scripts/circuit-html/quantum.js",
                        "~/Scripts/circuit-html/quantum.workspace.js",
                        "~/Scripts/circuit-html/quantum.gate.js",
                        "~/Scripts/circuit-html/quantum.gatefactory.js",
                        "~/Scripts/circuit-html/quantum.factoryshowroom.js",
                        "~/Scripts/circuit-html/quantum.slot.js",
                        "~/Scripts/circuit-html/quantum.circuit.js",
                        "~/Scripts/circuit-html/quantum.circuitbuilder.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                        "~/Content/bootstrap.css",
                        "~/Content/site.css"));

            bundles.Add(new StyleBundle("~/Content/quantum").Include(
                        "~/Content/circuit-html/quantum.css"));
        }
    }
}
