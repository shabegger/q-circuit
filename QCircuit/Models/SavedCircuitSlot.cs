using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace QCircuit.Models
{
    public class SavedCircuitSlot
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }


        #region Foreign Keys

        [JsonIgnore]
        public Guid CircuitId { get; set; }

        #endregion


        #region References

        [JsonIgnore]
        public virtual SavedCircuit Circuit { get; set; }

        public virtual ICollection<SavedGateInstance> Gates { get; set; }

        #endregion


        #region Properties

        public int SlotNumber { get; set; }

        #endregion
    }
}