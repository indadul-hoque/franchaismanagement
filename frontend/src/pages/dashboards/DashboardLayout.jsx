import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import UnifiedSidebar from './components/layout/UnifiedSidebar';
import UnifiedHeader from './components/layout/UnifiedHeader';
import { Spinner } from 'react-bootstrap';

export default function DashboardLayout() {
    return (
        <div className="d-flex min-vh-100" style={{ backgroundColor: "#f8f9fa", overflowX: "hidden" }}>
            <style>{`
                .stat-card {
                  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s ease;
                  border-radius: 16px !important;
                }
                .stat-card:hover {
                  transform: translateY(-4px);
                  box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.08) !important;
                }
                .main-content-area {
                    flex-grow: 1;
                    padding: 1.5rem;
                    height: calc(100vh - 72px);
                    overflow-y: auto;
                }
                @media (max-width: 768px) {
                    .main-content-container {
                        padding-left: 0;
                    }
                }
                @media (min-width: 768px) {
                    .main-content-container {
                        padding-left: 260px;
                    }
                }
            `}</style>
            
            <UnifiedSidebar />

            <div className="flex-grow-1 d-flex flex-column main-content-container w-100" style={{ transition: 'padding-left 0.3s' }}>
                <UnifiedHeader />
                <div className="main-content-area">
                    <Suspense fallback={
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <Spinner animation="grow" variant="primary" />
                        </div>
                    }>
                        <Outlet />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
