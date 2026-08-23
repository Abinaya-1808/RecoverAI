import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { MobileNav } from './components/layout/MobileNav';
import { AICopilotDrawer } from './components/copilot/AICopilotDrawer';

import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingWizard } from './pages/OnboardingWizard';
import { DashboardPage } from './pages/DashboardPage';
import { RecoveryCenterPage } from './pages/RecoveryCenterPage';
import { FailedPaymentsPage } from './pages/FailedPaymentsPage';
import { PaymentDetailPage } from './pages/PaymentDetailPage';
import { CustomersPage } from './pages/CustomersPage';
import { Customer360Page } from './pages/Customer360Page';
import { AIRecoveryIntelligencePage } from './pages/AIRecoveryIntelligencePage';
import { RevenueAnalyticsPage } from './pages/RevenueAnalyticsPage';
import { RecoveryCampaignsPage } from './pages/RecoveryCampaignsPage';
import { AutomationCenterPage } from './pages/AutomationCenterPage';
import { RescueSimulatorPage } from './pages/RescueSimulatorPage';
import { ReportsPage } from './pages/ReportsPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';

import { Payment, Customer } from './types';

const MainAppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>('/landing');
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);

  // Selected Detail States
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  const handleSelectPayment = (payment: Payment) => {
    setSelectedPayment(payment);
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCurrentPath('/customer-detail');
  };

  // Check if landing, auth, or onboarding full-screen views
  const isFullScreenView = ['/landing', '/', '/auth', '/onboarding'].includes(currentPath);

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans">
      
      {isFullScreenView ? (
        <main className="flex-1">
          {(currentPath === '/landing' || currentPath === '/') && <LandingPage onNavigate={handleNavigate} />}
          {currentPath === '/auth' && <AuthPage onNavigate={handleNavigate} />}
          {currentPath === '/onboarding' && <OnboardingWizard onNavigate={handleNavigate} />}
        </main>
      ) : (
        <div className="flex flex-1 min-h-screen">
          
          {/* Desktop Sidebar */}
          <Sidebar 
            currentPath={currentPath} 
            onNavigate={handleNavigate} 
            onOpenCopilot={() => setIsCopilotOpen(true)} 
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            
            <TopBar 
              onNavigate={handleNavigate} 
              onOpenCopilot={() => setIsCopilotOpen(true)} 
            />

            <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
              {currentPath === '/dashboard' && (
                <DashboardPage 
                  onNavigate={handleNavigate} 
                  onSelectPayment={handleSelectPayment} 
                />
              )}

              {currentPath === '/recovery-center' && (
                <RecoveryCenterPage 
                  onNavigate={handleNavigate} 
                  onSelectPayment={handleSelectPayment} 
                />
              )}

              {currentPath === '/payments' && (
                <FailedPaymentsPage 
                  onNavigate={handleNavigate} 
                  onSelectPayment={handleSelectPayment} 
                />
              )}

              {currentPath === '/customers' && (
                <CustomersPage 
                  onNavigate={handleNavigate} 
                  onSelectCustomer={handleSelectCustomer} 
                />
              )}

              {currentPath === '/customer-detail' && (
                <Customer360Page 
                  customer={selectedCustomer} 
                  onBack={() => handleNavigate('/customers')} 
                  onNavigateSimulator={() => handleNavigate('/simulator')} 
                />
              )}

              {currentPath === '/ai-intelligence' && (
                <AIRecoveryIntelligencePage 
                  onNavigate={handleNavigate} 
                />
              )}

              {currentPath === '/analytics' && (
                <RevenueAnalyticsPage 
                  onNavigate={handleNavigate} 
                />
              )}

              {currentPath === '/campaigns' && (
                <RecoveryCampaignsPage 
                  onNavigate={handleNavigate} 
                />
              )}

              {currentPath === '/automation' && (
                <AutomationCenterPage 
                  onNavigate={handleNavigate} 
                />
              )}

              {currentPath === '/simulator' && (
                <RescueSimulatorPage 
                  onNavigate={handleNavigate} 
                />
              )}

              {currentPath === '/reports' && (
                <ReportsPage 
                  onNavigate={handleNavigate} 
                />
              )}

              {currentPath === '/integrations' && (
                <IntegrationsPage 
                  onNavigate={handleNavigate} 
                />
              )}

              {currentPath === '/notifications' && (
                <NotificationsPage 
                  onNavigate={handleNavigate} 
                />
              )}

              {currentPath === '/settings' && (
                <SettingsPage 
                  onNavigate={handleNavigate} 
                />
              )}
            </main>

            {/* Mobile Bottom Navigation */}
            <MobileNav 
              currentPath={currentPath} 
              onNavigate={handleNavigate} 
              onOpenCopilot={() => setIsCopilotOpen(true)} 
            />

          </div>

        </div>
      )}

      {/* Floating AI Copilot Slide-Over Drawer */}
      <AICopilotDrawer 
        isOpen={isCopilotOpen} 
        onClose={() => setIsCopilotOpen(false)} 
        onNavigate={handleNavigate} 
      />

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <PaymentDetailPage 
          payment={selectedPayment} 
          onClose={() => setSelectedPayment(null)} 
          onNavigateSimulator={() => handleNavigate('/simulator')} 
        />
      )}

    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
