import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Plans from './pages/Plans';
import Layout from './components/Layout';
import Communities from './pages/Communities';
import CommunityDetail from './pages/CommunityDetail';
import BarrierGates from './pages/BarrierGates';
import BarrierGateDetail from './pages/BarrierGateDetail';
import Frames from './pages/Frames';
import FrameDetail from './pages/FrameDetail';
import PlanDetail from './pages/PlanDetail';
import PlanCommunities from './pages/PlanCommunities';
import PlanBarriers from './pages/PlanBarriers';
import PlanFrames from './pages/PlanFrames';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
          <Routes>
            {/* 公开路由 */}
            <Route path="/login" element={<Login />} />

            {/* 受保护路由 */}
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={<Navigate to="/plans" replace />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/plans/:id" element={<PlanDetail />} />
              <Route path="/communities" element={<Communities />} />
              <Route path="/communities/:id" element={<CommunityDetail />} />
              <Route path="/barrier-gates" element={<BarrierGates />} />
              <Route path="/barrier-gates/:id" element={<BarrierGateDetail />} />
              <Route path="/frames" element={<Frames />} />
              <Route path="/frames/:id" element={<FrameDetail />} />
              <Route path="/plan-communities" element={<PlanCommunities />} />
              <Route path="/plan-barriers" element={<PlanBarriers />} />
              <Route path="/plan-frames" element={<PlanFrames />} />
            </Route>

            {/* 重定向 */}
            <Route path="*" element={<Navigate to="/plans" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
