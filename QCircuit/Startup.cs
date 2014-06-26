using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(QCircuit.Startup))]
namespace QCircuit
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
