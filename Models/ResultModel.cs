
namespace bilihan_online.Models
{
    public class ResultModel
    {
        public bool IsSuccess { get; set; }
        public bool IsListResult { get; set; }
        public int ItemsGenerated { get; set; }
        public object Result { get; set; }

        public static implicit operator List<object>(ResultModel v)
        {
            throw new NotImplementedException();
        }
    }
}
