using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace QCircuit.Models
{
    public class SavedCircuit
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }


        #region Foreign Keys

        [JsonIgnore]
        public string UserId { get; set; }

        #endregion


        #region References

        [JsonIgnore]
        public virtual ApplicationUser User { get; set; }

        public virtual ICollection<SavedCircuitSlot> Slots { get; set; }

        #endregion


        #region Properties

        public string Name { get; set; }

        #endregion
    }
}