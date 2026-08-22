import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import Sidebar from '../components/layout/Sidebar';
import ShareModal from '../components/modals/ShareModal';
import {
  Wallet,
  Calendar,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Hotel,
  Plane,
  Utensils,
  Camera,
  ArrowLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  PieChart as PieChartIcon,
} from 'lucide-react';

export default function BudgetAnalysisPage() {
  const { tripId } = useParams();
  const { getTrip, calculateTripTotals, formatPrice, currency } = useTrip();
  const navigate = useNavigate();
  const [shareModalOpen, setShareModalOpen] = React.useState(false);

  const trip = getTrip(tripId) || getTrip('trip-royal-rajasthan');

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8f9fa] text-center">
        <div>
          <h2 className="text-2xl font-bold font-['Montserrat'] text-[#00236f] mb-2">Trip Not Found</h2>
          <Link to="/" className="px-6 py-2.5 bg-[#00236f] text-white rounded-full text-xs font-bold font-['Inter'] uppercase tracking-wider">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { totalSpent, breakdown } = calculateTripTotals(trip);
  const totalBudget = trip.budget?.totalBudget || 85000;
  const utilizationPercent = Math.min(100, Math.round((totalSpent / totalBudget) * 100)) || 0;
  const isUnderBudget = totalSpent <= totalBudget;

  const totalDays = 10;
  const dailyAverage = Math.round(totalSpent / totalDays) || 6850;
  const dailyCap = trip.budget?.dailyCap || 8500;
  const percentBelowCap = Math.max(0, Math.round(((dailyCap - dailyAverage) / dailyCap) * 100));

  // Category percentages
  const lodgingPercent = totalSpent ? Math.round((breakdown.lodging / totalSpent) * 100) : 45;
  const foodPercent = totalSpent ? Math.round((breakdown.food / totalSpent) * 100) : 25;
  const activitiesPercent = totalSpent ? Math.round((breakdown.activities / totalSpent) * 100) : 18;
  const transportPercent = totalSpent ? Math.round((breakdown.transport / totalSpent) * 100) : 12;

  // Mock Indian daily spending for the past 7 days
  const dailyData = [
    { day: 'Mon', amount: 5800, isOver: false },
    { day: 'Tue', amount: 7200, isOver: false },
    { day: 'Wed', amount: 9800, isOver: true },
    { day: 'Thu', amount: 4500, isOver: false },
    { day: 'Fri', amount: 6900, isOver: false },
    { day: 'Sat', amount: 5200, isOver: false },
    { day: 'Sun', amount: 6300, isOver: false },
  ];

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] font-['Inter'] antialiased min-h-screen flex">
      {/* Side Navigation Bar */}
      <Sidebar
        tripId={trip.id}
        onShareClick={() => setShareModalOpen(true)}
        activeTab="budget"
        onTabChange={(tab) => {
          if (tab === 'itinerary') navigate(`/trips/${trip.id}/edit`);
          if (tab === 'documents') navigate(`/trips/${trip.id}/edit`);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 md:p-10 bg-[#f8f9fa] min-h-screen">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-bold font-['Inter'] text-[#757682] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Link to={`/trips/${trip.id}/edit`} className="hover:underline flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Planner
              </Link>
              <span>•</span>
              <span>🇮🇳 Indian Itinerary Budget Analysis</span>
            </p>
            <h1 className="text-3xl md:text-4xl font-bold font-['Montserrat'] text-[#191c1d] tracking-tight">
              {trip.name}
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-[#006c49]/10 px-4 py-2 rounded-full border border-[#006c49]/20 self-start md:self-auto">
            <CheckCircle2 className="w-4 h-4 text-[#006c49]" />
            <span className="text-xs font-bold font-['Inter'] text-[#006c49]">
              On Track ({utilizationPercent}% Utilized)
            </span>
          </div>
        </header>

        {/* Key Metrics Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Metric Card 1: Total Spent */}
          <div className="bg-white rounded-2xl p-6 border border-[#c5c5d3] shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#00236f]/10 flex items-center justify-center text-[#00236f]">
                <Wallet className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold font-['Inter'] text-[#444651]">Total Spent</h3>
            </div>
            <p className="text-3xl font-bold font-['Montserrat'] text-[#191c1d]">
              {formatPrice(totalSpent)}
            </p>
            <div className="mt-4 w-full bg-[#edeeef] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#00236f] h-full rounded-full transition-all duration-500"
                style={{ width: `${utilizationPercent}%` }}
              ></div>
            </div>
            <p className="text-xs font-bold font-['Inter'] text-[#757682] uppercase tracking-wider mt-2 text-right">
              of {formatPrice(totalBudget)} target budget
            </p>
          </div>

          {/* Metric Card 2: Daily Average */}
          <div className="bg-white rounded-2xl p-6 border border-[#c5c5d3] shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#006c49]/10 flex items-center justify-center text-[#006c49]">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold font-['Inter'] text-[#444651]">Daily Average</h3>
            </div>
            <p className="text-3xl font-bold font-['Montserrat'] text-[#191c1d]">
              {formatPrice(dailyAverage)}
              <span className="text-sm font-normal text-[#757682] ml-1">/day</span>
            </p>
            <div className="mt-4 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-[#006c49]" />
              <span className="text-xs font-bold font-['Inter'] text-[#006c49]">
                {percentBelowCap}% below daily cap ({formatPrice(dailyCap)})
              </span>
            </div>
          </div>

          {/* Metric Card 3: Projected Total */}
          <div className="bg-white rounded-2xl p-6 border border-[#c5c5d3] shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#ef9900]/20 flex items-center justify-center text-[#5c3800]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold font-['Inter'] text-[#444651]">Projected Total</h3>
            </div>
            <p className="text-3xl font-bold font-['Montserrat'] text-[#191c1d]">
              {formatPrice(totalSpent + 13500)}
              <span className="text-sm font-normal text-[#757682] ml-1">est.</span>
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-[#757682] font-['Inter']">
                Based on planned stays & reserved thalis
              </span>
            </div>
          </div>
        </section>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column (Charts) - 8 cols */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            {/* Spending Breakdown (Donut Chart & Metrics) */}
            <div className="bg-white rounded-2xl p-6 border border-[#c5c5d3] shadow-xs flex flex-col">
              <h3 className="text-lg font-bold font-['Montserrat'] text-[#191c1d] mb-6">
                Spending Breakdown by Category
              </h3>

              <div className="flex flex-col md:flex-row items-center justify-around flex-1 gap-8">
                {/* Donut Chart Visual */}
                <div className="relative w-48 h-48 rounded-full shadow-inner flex items-center justify-center"
                     style={{
                       background: `conic-gradient(#00236f 0% ${lodgingPercent}%, #006c49 ${lodgingPercent}% ${lodgingPercent + foodPercent}%, #ffb95f ${lodgingPercent + foodPercent}% ${lodgingPercent + foodPercent + transportPercent}%, #FF5722 ${lodgingPercent + foodPercent + transportPercent}% 100%)`
                     }}
                >
                  <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-xs">
                    <span className="text-2xl font-bold font-['Montserrat'] text-[#00236f]">{utilizationPercent}%</span>
                    <span className="text-[10px] font-bold font-['Inter'] uppercase tracking-wider text-[#757682]">Utilized</span>
                  </div>
                </div>

                {/* Legend & Breakdown */}
                <div className="flex flex-col gap-3.5 w-full md:w-auto">
                  <div className="flex items-center justify-between gap-8">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#00236f]"></div>
                      <span className="text-xs font-bold font-['Inter'] text-[#191c1d]">🏨 Havelis & Stays</span>
                    </div>
                    <span className="font-['JetBrains Mono'] font-bold text-sm text-[#191c1d]">
                      {formatPrice(breakdown.lodging || 46500)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-8">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#006c49]"></div>
                      <span className="text-xs font-bold font-['Inter'] text-[#191c1d]">🍛 Food, Thalis & Dining</span>
                    </div>
                    <span className="font-['JetBrains Mono'] font-bold text-sm text-[#191c1d]">
                      {formatPrice(breakdown.food || 12500)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-8">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#ffb95f]"></div>
                      <span className="text-xs font-bold font-['Inter'] text-[#191c1d]">🚆 Trains & Cabs</span>
                    </div>
                    <span className="font-['JetBrains Mono'] font-bold text-sm text-[#191c1d]">
                      {formatPrice(breakdown.transport || 6200)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-8">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#FF5722]"></div>
                      <span className="text-xs font-bold font-['Inter'] text-[#191c1d]">🏛️ Fort Entry & Safaris</span>
                    </div>
                    <span className="font-['JetBrains Mono'] font-bold text-sm text-[#191c1d]">
                      {formatPrice(breakdown.activities || 9500)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Spending vs Cap (Bar Chart) */}
            <div className="bg-white rounded-2xl p-6 border border-[#c5c5d3] shadow-xs">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold font-['Montserrat'] text-[#191c1d]">
                    Daily Spending Trend
                  </h3>
                  <p className="text-xs text-[#757682]">Tracked against your daily cap of {formatPrice(dailyCap)}</p>
                </div>
                <span className="text-[11px] font-bold font-['Inter'] uppercase tracking-wider bg-[#f3f4f5] px-3 py-1 rounded-full text-[#00236f]">
                  Past 7 Days
                </span>
              </div>

              <div className="h-52 relative flex items-end gap-3 sm:gap-6 justify-between pt-6 pb-2 border-b border-[#c5c5d3]">
                {/* Threshold Line for Daily Cap */}
                <div className="absolute top-12 left-0 w-full border-t border-dashed border-[#ba1a1a]/60 z-0">
                  <span className="absolute -top-5 right-0 text-[11px] font-bold font-['JetBrains Mono'] text-[#ba1a1a]">
                    Daily Cap: {formatPrice(dailyCap)}
                  </span>
                </div>

                {/* Day Bars */}
                {dailyData.map((d, i) => {
                  const heightPercent = Math.min(100, Math.round((d.amount / 10000) * 100));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative z-10">
                      <div className="w-full bg-[#f3f4f5] rounded-t-lg h-40 flex items-end overflow-hidden">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-300 ${
                            d.isOver ? 'bg-[#FF5722]' : 'bg-[#00236f]/80 group-hover:bg-[#00236f]'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        ></div>
                      </div>
                      <span className="absolute -top-7 text-[10px] font-bold font-['JetBrains Mono'] opacity-0 group-hover:opacity-100 transition-opacity bg-[#191c1d] text-white px-1.5 py-0.5 rounded shadow-sm">
                        {formatPrice(d.amount)}
                      </span>
                      <span className="text-xs font-bold font-['Inter'] text-[#444651] mt-1">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (Alerts & Top Expenses) - 4 cols */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            {/* Category Alert Card */}
            <div className="bg-[#ffdad6]/40 border border-[#ba1a1a]/20 rounded-2xl p-5 shadow-xs">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#ba1a1a] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold font-['Montserrat'] text-[#93000a]">
                    Heritage Stay Budget Alert
                  </h4>
                  <p className="text-xs font-['Inter'] text-[#444651] mt-1 mb-3 leading-relaxed">
                    Heritage havelis & palace stays utilized 55% of total budget. Consider booking local heritage homestays for remaining stops.
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-['JetBrains Mono'] font-bold text-[#ba1a1a]">
                      {formatPrice(breakdown.lodging || 46500)} Allocated
                    </span>
                    <button
                      onClick={() => navigate(`/trips/${trip.id}/edit`)}
                      className="text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#00236f] hover:underline"
                    >
                      Adjust in Planner
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Indian Expenses List */}
            <div className="bg-white rounded-2xl border border-[#c5c5d3] shadow-xs flex-1 flex flex-col">
              <div className="p-5 border-b border-[#edeeef] flex justify-between items-center">
                <h3 className="text-base font-bold font-['Montserrat'] text-[#191c1d]">
                  Top Expenses
                </h3>
                <MoreVertical className="w-4 h-4 text-[#757682] cursor-pointer" />
              </div>

              <div className="p-3 divide-y divide-[#edeeef] flex-1">
                {/* Item 1 */}
                <div className="flex items-center justify-between p-3 hover:bg-[#f3f4f5] rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00236f]/10 flex items-center justify-center text-[#00236f]">
                      <Hotel className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold font-['Montserrat'] text-[#191c1d]">Taj Fateh Prakash Palace</p>
                      <p className="text-[11px] text-[#757682] font-['Inter']">Heritage Stay (Udaipur)</p>
                    </div>
                  </div>
                  <span className="font-['JetBrains Mono'] font-bold text-xs text-[#191c1d]">
                    {formatPrice(28000)}
                  </span>
                </div>

                {/* Item 2 */}
                <div className="flex items-center justify-between p-3 hover:bg-[#f3f4f5] rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00236f]/10 flex items-center justify-center text-[#00236f]">
                      <Hotel className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold font-['Montserrat'] text-[#191c1d]">Samode Haveli Jaipur</p>
                      <p className="text-[11px] text-[#757682] font-['Inter']">Palace Haveli (Jaipur)</p>
                    </div>
                  </div>
                  <span className="font-['JetBrains Mono'] font-bold text-xs text-[#191c1d]">
                    {formatPrice(18500)}
                  </span>
                </div>

                {/* Item 3 */}
                <div className="flex items-center justify-between p-3 hover:bg-[#f3f4f5] rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#006c49]/10 flex items-center justify-center text-[#006c49]">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold font-['Montserrat'] text-[#191c1d]">Chokhi Dhani Royal Thali</p>
                      <p className="text-[11px] text-[#757682] font-['Inter']">Food & Folk Dining</p>
                    </div>
                  </div>
                  <span className="font-['JetBrains Mono'] font-bold text-xs text-[#191c1d]">
                    {formatPrice(1800)}
                  </span>
                </div>

                {/* Item 4 */}
                <div className="flex items-center justify-between p-3 hover:bg-[#f3f4f5] rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FF5722]/10 flex items-center justify-center text-[#FF5722]">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold font-['Montserrat'] text-[#191c1d]">Amber Fort VIP Guided Tour</p>
                      <p className="text-[11px] text-[#757682] font-['Inter']">Culture & History</p>
                    </div>
                  </div>
                  <span className="font-['JetBrains Mono'] font-bold text-xs text-[#191c1d]">
                    {formatPrice(1200)}
                  </span>
                </div>
              </div>

              <div className="p-4 border-t border-[#edeeef] text-center">
                <Link
                  to={`/trips/${trip.id}/edit`}
                  className="text-xs font-bold font-['Inter'] uppercase tracking-wider text-[#00236f] hover:underline"
                >
                  Manage All Expenses in Planner →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        trip={trip}
      />
    </div>
  );
}
