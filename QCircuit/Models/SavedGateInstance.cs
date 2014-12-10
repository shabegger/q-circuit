using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace QCircuit.Models
{
    public class SavedGateInstance
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }


        #region Foreign Keys

        public Guid GateId { get; set; }

        #endregion


        #region References

        [JsonIgnore]
        public virtual SavedGate Gate { get; set; }

        [JsonIgnore]
        public virtual ICollection<SavedCircuitSlot> Slots { get; set; }

        #endregion


        #region Properties

        public double Position { get; set; }

        #endregion
    }
}