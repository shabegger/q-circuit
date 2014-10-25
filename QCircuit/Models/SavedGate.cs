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

        public Gate Gate
        {
            get
            {
                return new Gate(matrix);
            }
        }

        #endregion


        #region Constructors

        public SavedGate(ComplexMatrix matrix)
        {
            this.matrix = matrix;
        }

        #endregion


        #region Mapping

        private ComplexMatrix matrix;
        private string serializedMatrix
        {
            get
            {
                return JsonConvert.SerializeObject(matrix);
            }
            set
            {
                matrix = JsonConvert.DeserializeObject<ComplexMatrix>(value);
            }
        }

        public static readonly Expression<Func<SavedGate, string>> MatrixExpression = (s => s.serializedMatrix);

        #endregion
    }
}