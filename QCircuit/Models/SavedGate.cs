using Newtonsoft.Json;
using Quantum.Emulate;
using Quantum.Math;
using System;
using System.Linq.Expressions;

namespace QCircuit.Models
{
    public class SavedGate
    {
        public Guid Id { get; set; }


        #region Foreign Keys

        public string UserId { get; set; }

        #endregion


        #region References

        public virtual ApplicationUser User { get; set; }

        #endregion


        #region Properties

        public string Name { get; set; }
        public string Display { get; set; }

        public ComplexMatrix Matrix { get; set; }
        public string SerializedMatrix
        {
            get
            {
                return JsonConvert.SerializeObject(Matrix);
            }
            private set
            {
                Matrix = JsonConvert.DeserializeObject<ComplexMatrix>(value);
            }
        }

        #endregion
    }
}