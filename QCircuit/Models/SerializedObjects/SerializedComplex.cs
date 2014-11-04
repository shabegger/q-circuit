using Quantum.Math;

namespace QCircuit.Models.SerializedObjects
{
    public struct SerializedComplex
    {
        public double Real { get; set; }
        public double Imaginary { get; set; }

        public Complex ToComplex()
        {
            return new Complex(Real, Imaginary);
        }
    }

    public static class SerializedComplexExtension
    {
        public static ComplexMatrix ToComplexMatrix(this SerializedComplex[,] serialized)
        {
            var M = serialized.GetLength(0);
            var N = serialized.GetLength(1);
            var result = new Complex[M][];

            for (var m = 0; m < M; m++)
            {
                result[m] = new Complex[N];
                for (var n = 0; n < N; n++)
                {
                    result[m][n] = serialized[m, n].ToComplex();
                }
            }

            return new ComplexMatrix(result);
        }

        public static SerializedComplex ToSerializedComplex(this Complex complex)
        {
            return new SerializedComplex
            {
                Real = complex.Real,
                Imaginary = complex.Imaginary
            };
        }

        public static SerializedComplex[,] ToSerializedComplexMatrix(this ComplexMatrix matrix)
        {
            var result = new SerializedComplex[matrix.Size.M, matrix.Size.N];

            for (var m = 0; m < matrix.Size.M; m++)
            {
                for (var n = 0; n < matrix.Size.N; n++)
                {
                    result[m, n] = matrix[m][n].ToSerializedComplex();
                }
            }

            return result;
        }
    }
}