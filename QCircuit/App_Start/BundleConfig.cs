﻿using System.Web;
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

            bundles.Add(new ScriptBundle("~/bundles/main").Include(
                        "~/Scripts/main.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/common").Include(
                        "~/Scripts/common/guid.js"));

            bundles.Add(new ScriptBundle("~/bundles/bugfix").Include(
                        "~/Scripts/bugfix/bugfix.js",
                        "~/Scripts/bugfix/bugfix.flex.js"));

            bundles.Add(new ScriptBundle("~/bundles/dialog").Include(
                        "~/Scripts/dialog/dialog.js"));

            bundles.Add(new ScriptBundle("~/bundles/ux").Include(
                        "~/Scripts/ux/ux.js",
                        "~/Scripts/ux/ux.context.js",
                        "~/Scripts/ux/ux.message.js",
                        "~/Scripts/ux/ux.spinner.js"));

            bundles.Add(new ScriptBundle("~/bundles/mixins").Include(
                        "~/Scripts/mixins/mixins.js",
                        "~/Scripts/mixins/mixins.events.js"));

            bundles.Add(new ScriptBundle("~/bundles/interaction").Include(
                        "~/Scripts/interaction/interaction.js",
                        "~/Scripts/interaction/interaction.animation.js",
                        "~/Scripts/interaction/interaction.intersect.js",
                        "~/Scripts/interaction/interaction.touch.js",
                        "~/Scripts/interaction/interaction.context.js",
                        "~/Scripts/interaction/interaction.drag.js",
                        "~/Scripts/interaction/interaction.scroll.js"));

            bundles.Add(new ScriptBundle("~/bundles/utility").Include(
                        "~/Scripts/utility/utility.js",
                        "~/Scripts/utility/utility.fn.js"));

            bundles.Add(new ScriptBundle("~/bundles/quantum").Include(
                        "~/Scripts/circuit/quantum.js",
                        "~/Scripts/circuit/quantum.workspace.js",
                        "~/Scripts/circuit/quantum.toolbar.js",
                        "~/Scripts/circuit/quantum.gate.js",
                        "~/Scripts/circuit/quantum.gatefactory.js",
                        "~/Scripts/circuit/quantum.factoryshowroom.js",
                        "~/Scripts/circuit/quantum.slot.js",
                        "~/Scripts/circuit/quantum.circuit.js",
                        "~/Scripts/circuit/quantum.circuitbuilder.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                        "~/Content/main/main.css",
                        "~/Content/dialog/dialog.css",
                        "~/Content/validation.css"));

            bundles.Add(new StyleBundle("~/Content/bugfix").Include(
                        "~/Content/bugfix/bugfix.css"));

            bundles.Add(new StyleBundle("~/Content/dialog").Include(
                        "~/Content/dialog/dialog.css"));

            bundles.Add(new StyleBundle("~/Content/ux").Include(
                        "~/Content/ux/ux.css"));

            bundles.Add(new StyleBundle("~/Content/quantum").Include(
                        "~/Content/circuit/quantum.css"));
        }
    }
}
