import React, { useState } from 'react';
import { SplashScreen } from './screens/SplashScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RoleSelectionScreen } from './screens/RoleSelectionScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { AccountReviewScreen } from './screens/AccountReviewScreen';
import { PatientHomeScreen } from './screens/PatientHomeScreen';
import { DoctorDashboardScreen } from './screens/DoctorDashboardScreen';
import { PharmacyDashboardScreen } from './screens/PharmacyDashboardScreen';
import { LabDashboardScreen } from './screens/LabDashboardScreen';
import { ChatScreen } from './screens/ChatScreen';
import { DoctorListScreen } from './screens/DoctorListScreen';
import { DoctorProfileScreen } from './screens/DoctorProfileScreen';
import { PharmacyListScreen } from './screens/PharmacyListScreen';
import { PharmacyProfileScreen } from './screens/PharmacyProfileScreen';
import { LabListScreen } from './screens/LabListScreen';
import { LabProfileScreen } from './screens/LabProfileScreen';
import { MedicineLibraryScreen } from './screens/MedicineLibraryScreen';
import { MedicineDetailScreen } from './screens/MedicineDetailScreen';
import { LibraryHubScreen } from './screens/LibraryHubScreen';
import { PathologyLibraryScreen } from './screens/PathologyLibraryScreen';
import { PathologyDetailScreen } from './screens/PathologyDetailScreen';
import { LibraryAdminScreen } from './screens/LibraryAdminScreen';
import { AdminLoginScreen } from './screens/AdminLoginScreen';
import { ArticleDetailScreen } from './screens/ArticleDetailScreen';
import { PreOpListScreen } from './screens/PreOpListScreen'; // New Import
import { Toast } from './components/Toast';
import { Doctor, Pharmacy, Laboratory, MedicineProfile, PathologyProfile, Article } from './types';
import { ProtectedRoute } from './components/ProtectedRoute';

// Design System Showcase Component
import { ChevronLeft } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { DoctorCard } from './components/DoctorCard';
import { Banner } from './components/Banner';
import { Avatar } from './components/Avatar';

const UIKitShowcase = ({ onBack }: { onBack: () => void }) => (
   <div className="min-h-screen bg-gray-bg p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"><ChevronLeft/></button>
            <div>
              <h1 className="font-heading text-3xl font-bold text-secondary">Dr. Goyo</h1>
              <p className="text-gray-500 mt-1">Design System & Dashboard (Demo)</p>
            </div>
          </div>
          <Avatar src="https://picsum.photos/200/200" alt="User" status="online" size="md" />
        </div>

        {/* Simplified preview of components */}
        <div className="grid md:grid-cols-2 gap-8">
           <Banner title="Bienvenido Paciente" subtitle="Tienes una cita próxima mañana a las 9:00 AM" type="premium" />
           <div className="bg-white p-6 rounded-2xl shadow-soft">
              <h3 className="font-heading font-semibold mb-4">Buscar Especialista</h3>
              <SearchBar />
           </div>
        </div>

        <section>
          <h2 className="font-heading text-xl font-semibold text-gray-800 mb-4">Doctores Recomendados</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             <DoctorCard 
               doctor={{ 
                 id: '1', 
                 name: 'Dr. Alejandro Goyo', 
                 specialty: 'Cardiólogo', 
                 rating: 4.9, 
                 reviews: 120, 
                 image: 'https://picsum.photos/200/300', 
                 distance: '1.2 km', 
                 location: 'Caracas',
                 price: 80,
                 nextAvailable: 'Hoy' 
               }} 
              />
          </div>
        </section>
      </div>
   </div>
);


type ScreenState = 'splash' | 'welcome' | 'login' | 'role_select' | 'register' | 'review' | 'home' | 'doctor_dashboard' | 'pharmacy_dashboard' | 'lab_dashboard' | 'admin_login' | 'admin_dashboard' | 'chat' | 'doctors' | 'doctor_profile' | 'pharmacies' | 'pharmacy_profile' | 'labs' | 'lab_profile' | 'library_hub' | 'medicine_library' | 'medicine_detail' | 'pathology_library' | 'pathology_detail' | 'article_detail' | 'preop_list' | 'uikit';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('splash');
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'pharmacy' | 'lab' | 'admin'>('patient');
  
  // Track authenticated user role (Public App)
  const [userRole, setUserRole] = useState<string | null>(null);

  // Track authenticated admin session (Private Internal App)
  const [adminSession, setAdminSession] = useState<{ role: 'master' | 'editor'; email: string } | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>(undefined);
  
  // Selection States
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [selectedLab, setSelectedLab] = useState<Laboratory | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineProfile | null>(null);
  const [selectedPathology, setSelectedPathology] = useState<PathologyProfile | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  // Filter Props
  const [openFiltersOnList, setOpenFiltersOnList] = useState(false);
  const [pharmacySearchQuery, setPharmacySearchQuery] = useState('');
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');
  const [doctorSpecialtyFilter, setDoctorSpecialtyFilter] = useState('');

  // Navigation Handlers
  const goBack = () => {
    if (currentScreen === 'register') setCurrentScreen('role_select');
    else if (currentScreen === 'role_select') setCurrentScreen('welcome');
    else if (currentScreen === 'login') setCurrentScreen('welcome');
    else if (currentScreen === 'admin_login') setCurrentScreen('welcome'); // Exit admin portal
    else if (currentScreen === 'uikit') setCurrentScreen('welcome');
    else if (currentScreen === 'chat') setCurrentScreen('home');
    else if (currentScreen === 'doctors') setCurrentScreen('home');
    else if (currentScreen === 'doctor_profile') setCurrentScreen('doctors');
    else if (currentScreen === 'pharmacies') setCurrentScreen('home');
    else if (currentScreen === 'pharmacy_profile') setCurrentScreen('pharmacies');
    else if (currentScreen === 'labs') setCurrentScreen('home');
    else if (currentScreen === 'lab_profile') setCurrentScreen('labs');
    else if (currentScreen === 'library_hub') setCurrentScreen('home');
    else if (currentScreen === 'medicine_library') setCurrentScreen('home'); // Now direct from Home
    else if (currentScreen === 'pathology_library') setCurrentScreen('home'); // Now direct from Home
    else if (currentScreen === 'medicine_detail') setCurrentScreen('medicine_library');
    else if (currentScreen === 'pathology_detail') setCurrentScreen('pathology_library');
    else if (currentScreen === 'article_detail') setCurrentScreen('home');
    else if (currentScreen === 'preop_list') setCurrentScreen('home');
  };

  // --- Public App Auth ---
  const handleLoginSuccess = () => {
     setUserRole('patient');
     setCurrentScreen('home');
  };

  const handleRegisterSuccess = (role: string) => {
    if (role === 'doctor') {
      setUserRole('doctor');
      setCurrentScreen('doctor_dashboard');
    } else if (role === 'pharmacy') {
      setUserRole('pharmacy');
      setCurrentScreen('pharmacy_dashboard');
    } else if (role === 'lab') {
      setUserRole('lab');
      setCurrentScreen('lab_dashboard');
    } else if (role === 'patient') {
      setUserRole('patient');
      setCurrentScreen('home');
    } else {
      setCurrentScreen('review'); 
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentScreen('welcome');
    setToastMessage("Has cerrado sesión correctamente");
    setShowToast(true);
  };

  // --- Internal Admin Auth ---
  const handleAdminLoginSuccess = () => {
    // In a real app, validation happens on server.
    setAdminSession({ role: 'master', email: 'master@drgoyo.com' });
    setCurrentScreen('admin_dashboard');
  };

  const handleAdminLogout = () => {
    setAdminSession(null);
    setCurrentScreen('admin_login');
    setToastMessage("Sesión administrativa cerrada");
    setShowToast(true);
  };

  // --- Feature Navigation ---
  const handleNavigateToChat = (message?: string) => {
    setChatInitialMessage(message);
    setCurrentScreen('chat');
  };

  const handleNavigateToDoctors = (openFilters = false, searchQuery = '', specialty = '') => {
    setOpenFiltersOnList(openFilters);
    setDoctorSearchQuery(searchQuery);
    setDoctorSpecialtyFilter(specialty);
    setCurrentScreen('doctors');
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setCurrentScreen('doctor_profile');
  };

  const handleNavigateToPharmacies = (searchQuery = '') => {
    setPharmacySearchQuery(searchQuery);
    setCurrentScreen('pharmacies');
  };

  const handleSelectPharmacy = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setCurrentScreen('pharmacy_profile');
  };

  const handleNavigateToLabs = () => {
    setCurrentScreen('labs');
  };

  const handleSelectLab = (lab: Laboratory) => {
    setSelectedLab(lab);
    setCurrentScreen('lab_profile');
  };

  // Library Navigation
  const handleNavigateToLibrary = () => {
    setCurrentScreen('library_hub');
  };

  const handleNavigateToMedicineLibrary = () => {
    setCurrentScreen('medicine_library');
  };

  const handleNavigateToPathologyLibrary = () => {
    setCurrentScreen('pathology_library');
  };

  const handleNavigateToPreOp = () => {
    setCurrentScreen('preop_list');
  };

  const handleSelectMedicine = (medicine: MedicineProfile) => {
    setSelectedMedicine(medicine);
    setCurrentScreen('medicine_detail');
  };

  const handleSelectPathology = (pathology: PathologyProfile) => {
    setSelectedPathology(pathology);
    setCurrentScreen('pathology_detail');
  };

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setCurrentScreen('article_detail');
  };

  // Centralized navigation handler for bottom bar
  const handleBottomNav = (tab: string) => {
    if (tab === 'home') setCurrentScreen('home');
    else if (tab === 'doctors') handleNavigateToDoctors();
    else if (tab === 'chat') handleNavigateToChat();
    else if (tab === 'pharmacy') handleNavigateToPharmacies();
    else if (tab === 'labs') handleNavigateToLabs();
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={() => setCurrentScreen('welcome')} />;
      case 'welcome':
        return (
          <WelcomeScreen 
            onLogin={() => setCurrentScreen('login')} 
            onRegister={() => setCurrentScreen('role_select')} 
            onAdminAccess={() => setCurrentScreen('admin_login')} // Simulate accessing admin.drgoyo.com
          />
        );
      case 'login':
        return <LoginScreen onBack={goBack} onLoginSuccess={handleLoginSuccess} />;
      case 'role_select':
        return (
          <RoleSelectionScreen 
            onBack={goBack} 
            onSelectRole={(role) => {
              // Ensure generic user cannot select Admin here anymore
              if (role !== 'admin' as any) {
                setSelectedRole(role as any);
                setCurrentScreen('register');
              }
            }} 
          />
        );
      case 'register':
        return (
          <RegisterScreen 
            role={selectedRole} 
            onBack={goBack} 
            onSubmit={handleRegisterSuccess} 
          />
        );
      case 'review':
        return <AccountReviewScreen onGoHome={() => setCurrentScreen('welcome')} />;
      
      // Patient Routes
      case 'home':
        return (
          <ProtectedRoute 
            allowedRoles={['patient']} 
            currentRole={userRole || 'patient'} 
            onRedirect={() => setCurrentScreen('login')}
          >
            <PatientHomeScreen 
              onLogout={handleLogout} 
              onNavigateToChat={handleNavigateToChat} 
              onNavigateToMedicines={handleNavigateToMedicineLibrary}
              onNavigateToPathologies={handleNavigateToPathologyLibrary}
              onNavigateToPreOp={handleNavigateToPreOp}
              onNavigate={handleBottomNav}
            />
          </ProtectedRoute>
        );
      
      // Dashboard Routes (Public App)
      case 'doctor_dashboard':
        return (
          <ProtectedRoute 
            allowedRoles={['doctor']} 
            currentRole={userRole || ''} 
            onRedirect={() => setCurrentScreen('login')}
          >
            <DoctorDashboardScreen onLogout={handleLogout} />
          </ProtectedRoute>
        );

      case 'pharmacy_dashboard':
        return (
          <ProtectedRoute 
            allowedRoles={['pharmacy']} 
            currentRole={userRole || ''} 
            onRedirect={() => setCurrentScreen('login')}
          >
            <PharmacyDashboardScreen onLogout={handleLogout} />
          </ProtectedRoute>
        );

      case 'lab_dashboard':
        return (
          <ProtectedRoute 
            allowedRoles={['lab']} 
            currentRole={userRole || ''} 
            onRedirect={() => setCurrentScreen('login')}
          >
            <LabDashboardScreen onLogout={handleLogout} />
          </ProtectedRoute>
        );
      
      // --- INTERNAL ADMIN ROUTES ---
      case 'admin_login':
        return (
          <AdminLoginScreen 
            onLoginSuccess={handleAdminLoginSuccess} 
            onBackToPublic={() => setCurrentScreen('welcome')} 
          />
        );

      case 'admin_dashboard':
        // Custom Protection Logic for Admin
        if (!adminSession || adminSession.role !== 'master') {
           // If accessing directly via code state without login
           return <AdminLoginScreen onLoginSuccess={handleAdminLoginSuccess} onBackToPublic={() => setCurrentScreen('welcome')} />;
        }
        return (
           <LibraryAdminScreen onLogout={handleAdminLogout} />
        );

      // Feature Routes
      case 'chat':
        return (
          <ChatScreen 
            initialMessage={chatInitialMessage} 
            onBack={goBack} 
            onViewDoctorList={(specialty) => handleNavigateToDoctors(false, '', specialty)}
          />
        );
      case 'doctors':
        return (
          <DoctorListScreen 
            onBack={goBack} 
            onSelectDoctor={handleSelectDoctor}
            initialOpenFilters={openFiltersOnList}
            onNavigate={handleBottomNav}
            initialSearchQuery={doctorSearchQuery}
            initialSpecialty={doctorSpecialtyFilter}
            onNavigateToArticle={handleSelectArticle} // Connected
          />
        );
      case 'doctor_profile':
        return selectedDoctor ? (
          <DoctorProfileScreen 
            doctor={selectedDoctor} 
            onBack={goBack}
            onChat={() => handleNavigateToChat(`Hola, quisiera más información sobre una consulta con ${selectedDoctor.name}.`)}
            onNavigate={handleBottomNav}
          />
        ) : <div>Error loading doctor</div>;
      case 'pharmacies':
        return (
          <PharmacyListScreen 
            onBack={goBack}
            onSelectPharmacy={handleSelectPharmacy}
            onNavigate={handleBottomNav}
            initialSearchQuery={pharmacySearchQuery}
            onNavigateToArticle={handleSelectArticle} // Connected
          />
        );
      case 'pharmacy_profile':
        return selectedPharmacy ? (
          <PharmacyProfileScreen 
            pharmacy={selectedPharmacy}
            onBack={goBack}
            onChat={() => handleNavigateToChat(`Hola, quisiera preguntar sobre disponibilidad de medicamentos en ${selectedPharmacy.name}.`)}
            onNavigate={handleBottomNav}
          />
        ) : <div>Error loading pharmacy</div>;
      case 'labs':
        return (
          <LabListScreen 
             onBack={goBack}
             onSelectLab={handleSelectLab}
             onNavigate={handleBottomNav}
             onNavigateToArticle={handleSelectArticle} // Connected
          />
        );
      case 'lab_profile':
        return selectedLab ? (
          <LabProfileScreen 
            lab={selectedLab}
            onBack={goBack}
            onChat={() => handleNavigateToChat(`Hola, quisiera información sobre los exámenes en ${selectedLab.name}.`)}
            onNavigate={handleBottomNav}
          />
        ) : <div>Error loading lab</div>;
        
      // Library Routes
      case 'library_hub':
        return (
          <LibraryHubScreen 
            onBack={goBack}
            onNavigateToMedicines={handleNavigateToMedicineLibrary}
            onNavigateToPathologies={handleNavigateToPathologyLibrary}
            onNavigate={handleBottomNav}
          />
        );
      case 'medicine_library':
        return (
          <MedicineLibraryScreen 
            onBack={goBack}
            onSelectMedicine={handleSelectMedicine}
            onNavigate={handleBottomNav}
          />
        );
      case 'medicine_detail':
        return selectedMedicine ? (
          <MedicineDetailScreen 
            medicine={selectedMedicine}
            onBack={goBack}
            onFindInPharmacies={handleNavigateToPharmacies}
            onNavigate={handleBottomNav}
          />
        ) : <div>Error loading medicine</div>;
      case 'pathology_library':
        return (
          <PathologyLibraryScreen 
            onBack={goBack}
            onSelectPathology={handleSelectPathology}
            onNavigate={handleBottomNav}
          />
        );
      case 'pathology_detail':
        return selectedPathology ? (
          <PathologyDetailScreen 
            pathology={selectedPathology}
            onBack={goBack}
            onConsultDoctors={(specialty) => handleNavigateToDoctors(false, '', specialty)}
            onNavigate={handleBottomNav}
          />
        ) : <div>Error loading pathology</div>;

      // New Article Detail Route
      case 'article_detail':
        return selectedArticle ? (
          <ArticleDetailScreen
            article={selectedArticle}
            onBack={goBack}
            onNavigate={handleBottomNav}
          />
        ) : <div>Error loading article</div>;
        
      case 'preop_list':
        return (
           <PreOpListScreen 
              onBack={goBack}
              onNavigate={handleBottomNav}
           />
        );

      case 'uikit':
        return <UIKitShowcase onBack={() => setCurrentScreen('welcome')} />;
      default:
        return <div>Error: Screen not found</div>;
    }
  };

  return (
    <>
      {renderScreen()}
      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </>
  );
};

export default App;