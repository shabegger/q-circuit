using System;
using System.Collections.Generic;

namespace QCircuit.Models
{
    public class SavedGateInstance
    {
        public Guid Id { get; set; }


        #region Foreign Keys

        public Guid GateId { get; set; }

        #endregion


        #region References

        public virtual SavedGateInstance Gate { get; set; }
        public virtual ICollection<SavedCircuitSlot> Slots { get; set; }

        #endregion


        #region Properties

        public int Position { get; set; }

        #endregion
    }
}