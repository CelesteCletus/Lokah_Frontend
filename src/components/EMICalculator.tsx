import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, Percent, Calendar, IndianRupee, Home } from 'lucide-react';

interface EMICalculatorProps {
  isModalView?: boolean;
}

export default function EMICalculator({ isModalView = false }: EMICalculatorProps) {
  const [propertyPrice, setPropertyPrice] = useState(10000000);
  const [downPayment, setDownPayment] = useState(2000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);

  const emiResult = useMemo(() => {
    const principal = propertyPrice - downPayment;
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = loanTenure * 12;

    if (principal <= 0) {
      return { emi: 0, totalInterest: 0, totalAmount: 0, principal };
    }

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    const totalAmount = emi * totalMonths;
    const totalInterest = totalAmount - principal;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount),
      principal,
    };
  }, [propertyPrice, downPayment, interestRate, loanTenure]);

  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const calculatorContent = (
    <div className={`relative z-10 max-w-6xl mx-auto ${isModalView ? 'px-0' : 'px-6 lg:px-8'}`}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full mb-6">
          <Calculator className="w-4 h-4 text-gold-400" />
          <span className="font-body text-gold-400 text-sm">Financial Planning</span>
        </div>
        <h2 className="section-heading mb-4">
          EMI <span className="text-gradient-gold">Calculator</span>
        </h2>
        <p className="font-body text-ivory-400 max-w-2xl mx-auto">
          Plan your property purchase with our smart EMI calculator. Get instant estimates for your home loan.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Inputs */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Property Price */}
          <div className="glass-card p-6">
            <label className="flex items-center gap-2 text-ivory-400 text-sm font-body mb-4">
              <Home className="w-4 h-4 text-champagne-400" />
              Property Price
            </label>
            <input
              type="range"
              min="5000000"
              max="50000000"
              step="100000"
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
              className="w-full h-2 bg-charcoal-700 rounded-lg appearance-none cursor-pointer accent-champagne-500"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="font-body text-ivory-500 text-xs">₹50 Lakhs</span>
              <input
                type="number"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="bg-charcoal-900/60 border border-gold-500/25 rounded-lg px-3 py-1.5 text-gold-400 text-center font-body text-sm font-semibold w-36 focus:outline-none focus:border-gold-400 transition-all"
              />
              <span className="font-body text-ivory-500 text-xs">₹5 Cr</span>
            </div>
          </div>

          {/* Down Payment */}
          <div className="glass-card p-6">
            <label className="flex items-center gap-2 text-ivory-400 text-sm font-body mb-4">
              <TrendingUp className="w-4 h-4 text-champagne-400" />
              Down Payment
            </label>
            <input
              type="range"
              min="1000000"
              max={propertyPrice * 0.9}
              step="100000"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full h-2 bg-charcoal-700 rounded-lg appearance-none cursor-pointer accent-champagne-500"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="font-body text-ivory-500 text-xs">₹10 Lakhs</span>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="bg-charcoal-900/60 border border-gold-500/25 rounded-lg px-3 py-1.5 text-gold-400 text-center font-body text-sm font-semibold w-36 focus:outline-none focus:border-gold-400 transition-all"
              />
              <span className="font-body text-ivory-500 text-xs">90% Max</span>
            </div>
          </div>

          {/* Rate and Tenure grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Interest Rate */}
            <div className="glass-card p-6">
              <label className="flex items-center gap-2 text-ivory-400 text-sm font-body mb-4">
                <Percent className="w-4 h-4 text-champagne-400" />
                Interest Rate
              </label>
              <input
                type="range"
                min="5"
                max="15"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-charcoal-700 rounded-lg appearance-none cursor-pointer accent-champagne-500"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="font-body text-ivory-500 text-xs">5%</span>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="bg-charcoal-900/60 border border-gold-500/25 rounded-lg px-3 py-1.5 text-gold-400 text-center font-body text-sm font-semibold w-24 focus:outline-none focus:border-gold-400 transition-all"
                />
                <span className="font-body text-ivory-500 text-xs">15%</span>
              </div>
            </div>

            {/* Loan Tenure */}
            <div className="glass-card p-6">
              <label className="flex items-center gap-2 text-ivory-400 text-sm font-body mb-4">
                <Calendar className="w-4 h-4 text-champagne-400" />
                Loan Tenure
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                className="w-full h-2 bg-charcoal-700 rounded-lg appearance-none cursor-pointer accent-champagne-500"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="font-body text-ivory-500 text-xs">5 Yrs</span>
                <input
                  type="number"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(Number(e.target.value))}
                  className="bg-charcoal-900/60 border border-gold-500/25 rounded-lg px-3 py-1.5 text-gold-400 text-center font-body text-sm font-semibold w-24 focus:outline-none focus:border-gold-400 transition-all"
                />
                <span className="font-body text-ivory-500 text-xs">30 Yrs</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card p-8 flex flex-col justify-between h-full bg-gradient-to-br from-charcoal-900/80 to-matte-950/80"
        >
          <div className="space-y-6">
            <h3 className="font-display text-xl text-ivory-50 pb-4 border-b border-ivory-400/10">Summary</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-body text-ivory-400 text-sm">Monthly EMI</p>
                <p className="font-display text-2xl md:text-3xl text-gold-400 font-semibold mt-1">
                  {formatCurrency(emiResult.emi)}
                  <span className="text-xs text-ivory-400/70 font-normal">/mo</span>
                </p>
              </div>
              <div>
                <p className="font-body text-ivory-400 text-sm">Principal Loan Amount</p>
                <p className="font-display text-lg text-ivory-100 font-medium mt-1">
                  {formatCurrency(emiResult.principal)}
                </p>
              </div>
              <div>
                <p className="font-body text-ivory-400 text-sm">Total Interest Payable</p>
                <p className="font-display text-lg text-ivory-100 font-medium mt-1">
                  {formatCurrency(emiResult.totalInterest)}
                </p>
              </div>
              <div>
                <p className="font-body text-ivory-400 text-sm">Total Amount (Principal+Int)</p>
                <p className="font-display text-lg text-ivory-100 font-medium mt-1">
                  {formatCurrency(emiResult.totalAmount)}
                </p>
              </div>
            </div>

            {/* Split bar */}
            <div className="pt-6 border-t border-ivory-400/10">
              <div className="flex justify-between text-xs font-body mb-2 text-ivory-400">
                <span>Principal vs Interest Split</span>
              </div>
              <div className="relative h-4 bg-charcoal-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(emiResult.principal / emiResult.totalAmount) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-champagne-500 to-gold-500"
                />
              </div>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-champagne-500 to-gold-500 rounded-full" />
                  <span className="font-body text-ivory-400 text-sm">
                    Principal ({Math.round((emiResult.principal / emiResult.totalAmount) * 100)}%)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-charcoal-600 rounded-full" />
                  <span className="font-body text-ivory-400 text-sm">
                    Interest ({Math.round((emiResult.totalInterest / emiResult.totalAmount) * 100)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full justify-center"
            >
              <IndianRupee className="w-5 h-5" />
              <span>Get Home Loan Quote</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );

  if (isModalView) {
    return calculatorContent;
  }

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-matte-black">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-charcoal-800/50 via-matte-900 to-matte-black" />
      </div>
      {calculatorContent}
    </section>
  );
}
