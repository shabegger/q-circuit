using System;

namespace QCircuit.Models
{
    public class SavedCircuit
    {
        public Guid Id { get; set; }


        #region Foreign Keys

        public string? UserId { get; set; }

        #endregion


        #region References

        public virtual ApplicationUser User { get; set; }

        #endregion


        #region Properties

        public int Slots { get; set; }

        #endregion
    }
}