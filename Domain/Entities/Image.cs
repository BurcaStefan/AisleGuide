using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Image
    {
        public Guid Id { get; set; }
        public Guid EntityId { get; set; }
        public string FileExtension { get; set; }
    }
}
