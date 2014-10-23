using System;

namespace QCircuit.Models
{
    public class SavedCircuitGate
    {
        public Guid Id { get; set; }


        #region Foreign Keys

        public Guid CircuitId { get; set; }
        public Guid GateId { get; set; }

        #endregion


        #region References

        public virtual SavedCircuit Circuit { get; set; }
        public virtual SavedGate Gate { get; set; }

        #endregion


        #region Properties

        public int Slot { get; set; }
        public int Position { get; set; }

        #endregion
    }
}