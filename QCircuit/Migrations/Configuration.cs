using QCircuit.Models;
using Quantum.Emulate;
using System;
using System.Data.Entity.Migrations;

namespace QCircuit.Migrations
{
    internal sealed class Configuration : DbMigrationsConfiguration<ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(ApplicationDbContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //

            context.Gates.AddOrUpdate(
                g => g.Name,
                new SavedGate
                {
                    Id = Guid.NewGuid(),
                    Name = "Hadamard",
                    Display = "<span class=\"q-gate-text\">H</span>",
                    Matrix = HadamardGate.Hadamard
                },
                new SavedGate
                {
                    Id = Guid.NewGuid(),
                    Name = "PauliX",
                    Display = "<span class=\"q-gate-text\">X</span>",
                    Matrix = PauliXGate.PauliX
                },
                new SavedGate
                {
                    Id = Guid.NewGuid(),
                    Name = "PauliY",
                    Display = "<span class=\"q-gate-text\">Y</span>",
                    Matrix = PauliYGate.PauliY
                },
                new SavedGate
                {
                    Id = Guid.NewGuid(),
                    Name = "PauliZ",
                    Display = "<span class=\"q-gate-text\">Z</span>",
                    Matrix = PauliZGate.PauliZ
                },
                new SavedGate
                {
                    Id = Guid.NewGuid(),
                    Name = "S",
                    Display = "<span class=\"q-gate-text\">S</span>",
                    Matrix = SGate.S
                },
                new SavedGate
                {
                    Id = Guid.NewGuid(),
                    Name = "T",
                    Display = "<span class=\"q-gate-text\">T</span>",
                    Matrix = TGate.T
                },
                new SavedGate
                {
                    Id = Guid.NewGuid(),
                    Name = "SqrtNot",
                    Display = "<span class=\"q-gate-text\">√</span>",
                    Matrix = SqrtNotGate.SqrtNot
                });
        }
    }
}
