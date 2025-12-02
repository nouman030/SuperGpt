import React, { useContext, useState } from "react";
import { Appcontext } from "../contexts/Appcontext";
import { FiCheck, FiCpu, FiZap, FiStar, FiTrendingUp, FiShield } from "react-icons/fi";

const PlanCard = ({ plan, index }) => (
  <div
    className={`relative flex flex-col p-8 rounded-[2rem] transition-all duration-500 transform hover:-translate-y-2
      ${plan.highlight 
        ? "bg-gradient-to-b from-[var(--color-bg-secondary)] to-[var(--color-bg-primary)] border-2 border-accent shadow-2xl shadow-accent/20 scale-105 z-10" 
        : "bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-accent/50 hover:shadow-xl"
      }
    `}
    style={{ animationDelay: `${index * 100}ms` }}
  >
    {plan.highlight && (
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-accent text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-accent/30 tracking-wide uppercase">
        {plan.badge}
      </div>
    )}

    <div className="mb-8">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-2xl
        ${plan.highlight ? "bg-accent text-white shadow-lg shadow-accent/40" : "bg-[var(--color-bg-tertiary)] text-accent"}
      `}>
        {plan.icon}
      </div>
      <h3 className="text-2xl font-bold text-text-primary mb-2">{plan.name}</h3>
      <p className="text-text-secondary text-sm leading-relaxed min-h-[40px]">{plan.description}</p>
    </div>

    <div className="mb-8">
      <div className="flex items-baseline">
        <span className="text-5xl font-extrabold text-text-primary tracking-tight">{plan.price}</span>
        <span className="text-text-secondary text-lg ml-2 font-medium">{plan.period}</span>
      </div>
    </div>

    <div className="flex-1 mb-10">
      <ul className="space-y-4">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 group">
            <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 
              ${plan.highlight ? "bg-accent/20 text-accent" : "bg-[var(--color-bg-tertiary)] text-text-secondary group-hover:text-accent group-hover:bg-accent/10"} transition-colors duration-300`}>
              <FiCheck className="w-3 h-3" />
            </div>
            <span className="text-text-secondary text-sm font-medium group-hover:text-text-primary transition-colors duration-300">{feature}</span>
          </li>
        ))}
      </ul>
    </div>

    <button
      className={`w-full py-4 px-6 rounded-2xl font-bold text-base transition-all duration-300 transform active:scale-[0.98]
        ${plan.highlight
          ? "bg-accent text-white shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:bg-accent-hover"
          : "bg-[var(--color-bg-primary)] text-text-primary border-2 border-[var(--color-bg-tertiary)] hover:border-accent hover:text-accent"
        }
      `}
    >
      {plan.buttonText}
    </button>
  </div>
);

function Credits() {
  const { user } = useContext(Appcontext);
  const currentCredit = user?.credits || 1500;

  const plans = [
    {
      name: "Starter",
      price: "₹0",
      period: "/mo",
      description: "Essential tools for individuals just getting started.",
      features: ["3 Sub accounts", "2 Team members", "Basic pipelines", "Community Support"],
      buttonText: "Start Free",
      highlight: false,
      icon: <FiZap />,
    },
    {
      name: "Professional",
      price: "₹499",
      period: "/mo",
      description: "Power-packed features for growing agencies.",
      features: ["Unlimited pipelines", "5 Sub accounts", "Priority Support", "Advanced Analytics", "Custom Branding"],
      buttonText: "Upgrade Now",
      highlight: true,
      badge: "Most Popular",
      icon: <FiStar />,
    },
    {
      name: "Enterprise",
      price: "₹999",
      period: "/mo",
      description: "Maximum scalability for large organizations.",
      features: ["Unlimited Sub accounts", "Unlimited Team members", "24/7 Dedicated Support", "API Access", "SSO Integration"],
      buttonText: "Contact Sales",
      highlight: false,
      icon: <FiShield />,
    },
  ];

  return (
    <div className="h-full bg-[var(--color-bg-primary)] text-text-primary font-sans overflow-y-auto w-full transition-colors duration-300">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-bold mb-6">
              <FiTrendingUp className="w-4 h-4" />
              <span>Upgrade your experience</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              Simple pricing, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-600">
                no hidden fees.
              </span>
            </h1>
            <p className="text-text-secondary text-xl leading-relaxed">
              Choose the perfect plan for your needs. Upgrade anytime as your business scales.
            </p>
          </div>

          {/* Current Balance Card */}
          <div className="w-full lg:w-auto">
            <div className="bg-[var(--color-bg-secondary)]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-[var(--color-border)] shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center gap-6">
                <div className="p-5 bg-gradient-to-br from-accent to-purple-600 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FiCpu className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary font-semibold uppercase tracking-wider mb-1">Current Balance</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-text-primary">{currentCredit}</span>
                    <span className="text-sm text-text-secondary font-medium">credits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
          {plans.map((plan, index) => (
            <PlanCard key={index} plan={plan} index={index} />
          ))}
        </div>

        {/* FAQ CTA */}
        <div className="mt-24 text-center">
          <p className="text-text-secondary text-lg">
            Have questions? <button className="text-accent font-bold hover:underline">Chat with our team</button> or check out our <button className="text-accent font-bold hover:underline">documentation</button>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Credits;
