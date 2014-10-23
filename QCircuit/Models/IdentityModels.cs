using Microsoft.AspNet.Identity.EntityFramework;
using System.Collections.Generic;
using System.Data.Entity;

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

        public DbSet<SavedGate> Gates { get; set; }
        public DbSet<SavedCircuit> Circuits { get; set; }
        public DbSet<SavedCircuitGate> CircuitGates { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SavedGate>().Property(SavedGate.MatrixExpression);
            modelBuilder.Entity<SavedGate>().Ignore(s => s.Gate);

            base.OnModelCreating(modelBuilder);
        }
    }
}