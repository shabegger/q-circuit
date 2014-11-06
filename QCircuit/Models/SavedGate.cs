using Newtonsoft.Json;
using QCircuit.Models.SerializedObjects;
using Quantum.Emulate;
using Quantum.Math;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq.Expressions;

namespace QCircuit.Models
{
    public class SavedGate
    {
        public Guid Id { get; set; }


        #region Foreign Keys

        [JsonIgnore]
        public string UserId { get; set; }

        #endregion


        #region References

        [JsonIgnore]
        public virtual ApplicationUser User { get; set; }

        #endregion


        #region Properties

        public string Name { get; set; }
        public string Display { get; set; }

        [NotMapped]
        public SerializedComplex[,] Matrix { get; set; }

        [JsonIgnore]
        public string SerializedMatrix
        {
            get
            {
                return JsonConvert.SerializeObject(Matrix);
            }
            set
            {
                Matrix = JsonConvert.DeserializeObject<SerializedComplex[,]>(value);
            }
        }

        #endregion
    }
}