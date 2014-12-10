using QCircuit.Models;
using QCircuit.Models.SerializedObjects;
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
            context.Gates.AddOrUpdate(
                g => g.Name,
                new SavedGate
                {
                    Name = "Hadamard",
                    Display = "<span class=\"q-gate-text\">H</span>",
                    Matrix = HadamardGate.Hadamard.ToSerializedComplexMatrix()
                },
                new SavedGate
                {
                    Name = "PauliX",
                    Display = "<span class=\"q-gate-text\">X</span>",
                    Matrix = PauliXGate.PauliX.ToSerializedComplexMatrix()
                },
                new SavedGate
                {
                    Name = "PauliY",
                    Display = "<span class=\"q-gate-text\">Y</span>",
                    Matrix = PauliYGate.PauliY.ToSerializedComplexMatrix()
                },
                new SavedGate
                {
                    Name = "PauliZ",
                    Display = "<span class=\"q-gate-text\">Z</span>",
                    Matrix = PauliZGate.PauliZ.ToSerializedComplexMatrix()
                },
                new SavedGate
                {
                    Name = "S",
                    Display = "<span class=\"q-gate-text\">S</span>",
                    Matrix = SGate.S.ToSerializedComplexMatrix()
                },
                new SavedGate
                {
                    Name = "T",
                    Display = "<span class=\"q-gate-text\">T</span>",
                    Matrix = TGate.T.ToSerializedComplexMatrix()
                },
                new SavedGate
                {
                    Name = "SqrtNot",
                    Display = "<span class=\"q-gate-text\">√</span>",
                    Matrix = SqrtNotGate.SqrtNot.ToSerializedComplexMatrix()
                });
        }
    }
}
