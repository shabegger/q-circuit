using Microsoft.AspNet.Identity.EntityFramework;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace QCircuit.Models
{
    public class ApplicationUser : IdentityUser
    {
        public virtual ICollection<SavedGate> Gates { get; set; }
        public virtual ICollection<SavedCircuit> Circuits { get; set; }
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext() : base("DefaultConnection") { }

        private ApplicationUser _user = null;
        public ApplicationUser User
        {
            get
            {
                var user = HttpContext.Current.User;
                var userName = user == null ? null : user.Identity.Name;

                if (_user == null || _user.UserName != userName)
                {
                    _user = Users.FirstOrDefault(u => u.UserName == userName);
                }
                
                return _user;
            }
        }

        [JsonIgnore]
        public DbSet<SavedGate> Gates { get; set; }

        [JsonIgnore]
        public DbSet<SavedGateInstance> GateInstances { get; set; }

        [JsonIgnore]
        public DbSet<SavedCircuit> Circuits { get; set; }

        [JsonIgnore]
        public DbSet<SavedCircuitSlot> CircuitSlots { get; set; }
    }
}