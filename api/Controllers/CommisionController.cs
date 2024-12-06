using System.Globalization;
using Microsoft.AspNetCore.Mvc;

namespace FCamara.CommissionCalculator.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CommisionController : ControllerBase
    {
        private readonly CommissionCalculateService _commissionCalculateService = new();
        
        [ProducesResponseType(typeof(CommissionCalculationResponse), 200)]
        [HttpPost]
        public IActionResult Calculate(CommissionCalculationRequest calculationRequest)
        {            
            try {
              return Ok(_commissionCalculateService.CalculateCommission(calculationRequest));
            } catch (Exception error) {
              return StatusCode(500, error.InnerException?.Message);
            }
        }
    }

    public class CommissionCalculateService : CommissionCalculationRequest {
      public CommissionCalculationResponse CalculateCommission(CommissionCalculationRequest data) {
        decimal fcamaraCommission = CalculateCommissionInstance(20, data.LocalSalesCount, data.AverageSaleAmount) + CalculateCommissionInstance(35, data.ForeignSalesCount, data.AverageSaleAmount);
        decimal competitorCommission = CalculateCommissionInstance(2, data.LocalSalesCount, data.AverageSaleAmount) + CalculateCommissionInstance((decimal) 7.55, data.ForeignSalesCount, data.AverageSaleAmount);

        return new CommissionCalculationResponse() {
          FCamaraCommissionAmount = fcamaraCommission,
          CompetitorCommissionAmount = competitorCommission
        };
      }

      private static decimal CalculateCommissionInstance(decimal percentage, int salesCount, decimal averageSaleAmount) {
        decimal countXamount = salesCount * averageSaleAmount;
        decimal result = countXamount * (percentage / 100);

        return result;
      }
    }

    public class CommissionCalculationRequest
    {
        public int LocalSalesCount { get; set; }
        public int ForeignSalesCount { get; set; }
        public decimal AverageSaleAmount { get; set; }
    }

    public class CommissionCalculationResponse
    {
        public decimal FCamaraCommissionAmount { get; set; }

        public decimal CompetitorCommissionAmount { get; set; }
    }
}
