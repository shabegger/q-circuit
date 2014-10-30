using System;
using System.Collections.Generic;

namespace QCircuit.Models
{
    public class SavedCircuitSlot
    {
        public Guid Id { get; set; }


        #region Foreign Keys

        public Guid CircuitId { get; set; }

        #endregion


        #region References

        public virtual SavedCircuit Circuit { get; set; }
        public virtual ICollection<SavedGateInstance> Gates { get; set; }

        #endregion


        #region Properties

        public int SlotNumber { get; set; }

        #endregion
    }
}